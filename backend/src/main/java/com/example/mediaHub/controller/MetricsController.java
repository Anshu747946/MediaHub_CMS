package com.example.mediaHub.controller;
import com.example.mediaHub.dto.response.*;
import com.example.mediaHub.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/metrics") @RequiredArgsConstructor
public class MetricsController {
    private final MetricsService metricsService;
    @GetMapping("/{contentId}") @PreAuthorize("hasAnyRole('MARKETING','MANAGER')")
    public ResponseEntity<ApiResponse<MetricsResponse>> getMetrics(@PathVariable Long contentId){
        return ResponseEntity.ok(ApiResponse.success("OK",metricsService.getMetricsForContent(contentId)));
    }
    @GetMapping("/dashboard") @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(){
        return ResponseEntity.ok(ApiResponse.success("OK",metricsService.getDashboard()));
    }
}
