package com.example.mediaHub.dto.request;
import com.example.mediaHub.entity.enums.ContentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;
@Data public class ContentRequest {
    @NotBlank private String title;
    private String description;
    @NotNull private ContentType contentType;
    private String body;
    private String mediaUrl;
    private List<String> tags;
}
