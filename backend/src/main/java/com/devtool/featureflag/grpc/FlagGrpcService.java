package com.devtool.featureflag.grpc;

import com.devtool.featureflag.model.Flag;
import com.devtool.featureflag.service.FlagService;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.UUID;
import java.util.stream.Collectors;

@GrpcService
@RequiredArgsConstructor
public class FlagGrpcService extends FeatureFlagServiceGrpc.FeatureFlagServiceImplBase {

    private final FlagService flagService;

    @Override
    public void getFlag(GetFlagRequest request, StreamObserver<FlagResponse> responseObserver) {
        Flag flag;
        if (!request.getId().isEmpty()) {
            flag = flagService.getFlag(UUID.fromString(request.getId()));
        } else if (!request.getKey().isEmpty()) {
            flag = flagService.getFlagByKey(request.getKey());
        } else {
            responseObserver.onError(new IllegalArgumentException("ID or Key must be provided"));
            return;
        }

        responseObserver.onNext(mapToResponse(flag));
        responseObserver.onCompleted();
    }

    @Override
    public void getAllFlags(GetAllFlagsRequest request, StreamObserver<FlagsPageResponse> responseObserver) {
        Page<Flag> page = flagService
                .getAllFlags(PageRequest.of(request.getPage(), request.getSize() > 0 ? request.getSize() : 10));

        FlagsPageResponse response = FlagsPageResponse.newBuilder()
                .addAllContent(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .setTotalElements((int) page.getTotalElements())
                .setTotalPages(page.getTotalPages())
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void toggleFlag(ToggleFlagRequest request, StreamObserver<FlagResponse> responseObserver) {
        Flag flag = flagService.toggleFlag(UUID.fromString(request.getId()),
                request.getUserId().isEmpty() ? "grpc-user" : request.getUserId());
        responseObserver.onNext(mapToResponse(flag));
        responseObserver.onCompleted();
    }

    private FlagResponse mapToResponse(Flag flag) {
        return FlagResponse.newBuilder()
                .setId(flag.getId().toString())
                .setKey(flag.getKey())
                .setName(flag.getName())
                .setDescription(flag.getDescription() != null ? flag.getDescription() : "")
                .setEnabled(flag.getEnabled())
                .setArchived(flag.getArchived())
                .setCreatedAt(flag.getCreatedAt().toString())
                .setUpdatedAt(flag.getUpdatedAt().toString())
                .setVersion(flag.getVersion())
                .build();
    }
}
