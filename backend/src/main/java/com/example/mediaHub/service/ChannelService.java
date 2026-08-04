package com.example.mediaHub.service;
import com.example.mediaHub.dto.request.DistributeRequest;
import com.example.mediaHub.entity.*;
import com.example.mediaHub.entity.enums.*;
import com.example.mediaHub.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
@Slf4j @Service @RequiredArgsConstructor
public class ChannelService {
    private final ChannelRepository channelRepository;
    private final ContentRepository contentRepository;

    @Transactional(readOnly=true)
    public List<Channel> getActiveChannels(){return channelRepository.findByIsActiveTrue();}

    @Transactional(readOnly=true)
    public List<Channel> getAllChannels(){return channelRepository.findAll();}

    @Transactional
    public Channel updateChannelStatus(Long id, boolean isActive){
        Channel channel = channelRepository.findById(id).orElseThrow(() -> new RuntimeException("Channel not found"));
        channel.setIsActive(isActive);
        return channelRepository.save(channel);
    }

    @Transactional
    public List<ContentChannel> distributeContent(Long contentId,DistributeRequest req){
        Content content=contentRepository.findById(contentId).orElseThrow(()->new RuntimeException("Content not found"));
        if(content.getStatus()!=ContentStatus.APPROVED&&content.getStatus()!=ContentStatus.SCHEDULED)
            throw new RuntimeException("Content must be APPROVED to distribute");
        List<ContentChannel> results=new ArrayList<>();
        for(Long channelId:req.getChannelIds()){
            Channel channel=channelRepository.findById(channelId).orElseThrow(()->new RuntimeException("Channel not found: "+channelId));
            ContentChannel cc=ContentChannel.builder().content(content).channel(channel).distStatus(DistributionStatus.PENDING).build();
            cc.setDistStatus(DistributionStatus.SENT);
            cc.setDistributedAt(LocalDateTime.now());
            log.info("Content {} distributed to channel {}",contentId,channel.getName());
            results.add(cc);
        }
        boolean anySuccess=results.stream().anyMatch(cc->cc.getDistStatus()==DistributionStatus.SENT);
        if(anySuccess){content.setStatus(ContentStatus.PUBLISHED);content.setPublishedAt(LocalDateTime.now());contentRepository.save(content);}
        return results;
    }
}
