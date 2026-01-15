package com.devtool.featureflag.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Slf4j
public class NotificationService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(600000L); // 10 minute timeout
        this.emitters.add(emitter);

        emitter.onCompletion(() -> this.emitters.remove(emitter));
        emitter.onTimeout(() -> this.emitters.remove(emitter));
        emitter.onError((e) -> this.emitters.remove(emitter));

        try {
            emitter.send(SseEmitter.event().name("connected").data("Successfully subscribed to real-time updates"));
        } catch (IOException e) {
            log.error("Failed to send initial connection message", e);
        }

        return emitter;
    }

    @Async
    public void broadcast(String type, String key, Object payload) {
        log.info("Broadcasting event asynchronously on thread: {}. {}: {}",
                Thread.currentThread().getName(), type, key);

        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name(type)
                        .data(payload));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }

        this.emitters.removeAll(deadEmitters);
    }
}
