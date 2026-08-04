package com.example.mediaHub.controller;
import com.example.mediaHub.dto.request.DistributeRequest;
import com.example.mediaHub.dto.response.ApiResponse;
import com.example.mediaHub.entity.*;
import com.example.mediaHub.service.ChannelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/channels") @RequiredArgsConstructor
public class ChannelController {
    private final ChannelService channelService;
    @GetMapping @PreAuthorize("hasAnyRole('MARKETING','MANAGER','IT_SUPPORT')")
    public ResponseEntity<ApiResponse<List<Channel>>> getChannels(){
        return ResponseEntity.ok(ApiResponse.success("OK",channelService.getActiveChannels()));
    }
    @GetMapping("/all") @PreAuthorize("hasAnyRole('MANAGER','IT_SUPPORT')")
    public ResponseEntity<ApiResponse<List<Channel>>> getAllChannels(){
        return ResponseEntity.ok(ApiResponse.success("OK",channelService.getAllChannels()));
    }
    @PutMapping("/{id}/status") @PreAuthorize("hasAnyRole('MANAGER','IT_SUPPORT')")
    public ResponseEntity<ApiResponse<Channel>> updateChannelStatus(@PathVariable Long id, @RequestBody java.util.Map<String, Boolean> req) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", channelService.updateChannelStatus(id, req.get("isActive"))));
    }
    @PostMapping("/distribute/{contentId}") @PreAuthorize("hasRole('MARKETING')")
    public ResponseEntity<ApiResponse<List<ContentChannel>>> distribute(@PathVariable Long contentId,@Valid @RequestBody DistributeRequest req){
        return ResponseEntity.ok(ApiResponse.success("Distributed",channelService.distributeContent(contentId,req)));
    }
}
