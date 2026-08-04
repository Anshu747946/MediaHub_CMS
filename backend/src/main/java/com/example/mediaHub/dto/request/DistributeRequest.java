package com.example.mediaHub.dto.request;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;
@Data public class DistributeRequest {
    @NotEmpty private List<Long> channelIds;
}
