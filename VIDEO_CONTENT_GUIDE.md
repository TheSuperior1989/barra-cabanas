# Video Content Guide for Barra Cabanas Hero Section

## Current Video Playlist Implementation

The hero section now supports a seamless video playlist that cycles through multiple vacation scenes. Here's what's currently configured:

### Video Playlist Structure
```javascript
const videoPlaylist = [
  {
    src: "https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4",
    title: "Ocean Waves"
  },
  {
    src: "https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4", 
    title: "Beach Walk"
  },
  {
    src: "https://videos.pexels.com/video-files/1409899/1409899-hd_1920_1080_30fps.mp4",
    title: "Tropical Paradise"
  },
  {
    src: "https://videos.pexels.com/video-files/2169307/2169307-hd_1920_1080_30fps.mp4",
    title: "Sunset Dining"
  }
];
```

## Recommended Video Content Themes

### 1. **Ocean & Beach Scenes**
- Gentle waves lapping the shore
- Pristine white sand beaches
- Crystal clear turquoise water
- Aerial shots of coastline

### 2. **Luxury Accommodation**
- Elegant beachfront interiors
- Infinity pools overlooking ocean
- Stylish outdoor dining areas
- Sunset views from private decks

### 3. **Guest Experiences**
- Couples walking on beach at sunset
- Fine dining with ocean views
- Spa treatments in tropical settings
- Dhow cruises and water activities

### 4. **Local Wildlife & Nature**
- Dolphins swimming in clear waters
- Tropical birds and vegetation
- Underwater coral reef scenes
- Mozambican coastal landscapes

## Video Specifications

### Technical Requirements
- **Resolution**: 1920x1080 (Full HD minimum)
- **Frame Rate**: 30fps
- **Duration**: 15-45 seconds each
- **Format**: MP4 (H.264 codec)
- **Aspect Ratio**: 16:9
- **File Size**: Under 10MB per video (optimized for web)

### Quality Standards
- **Bitrate**: 2-4 Mbps for web optimization
- **Color Grading**: Warm, tropical tones
- **Stability**: Smooth, professional footage (no shaky cam)
- **Audio**: Muted (audio handled separately)

## Sourcing Options

### 1. **Professional Stock Video**
- **Shutterstock**: Premium quality, Mozambique-specific content
- **Getty Images**: High-end luxury resort footage
- **Adobe Stock**: Extensive beach and hospitality collection
- **Pexels**: Free high-quality videos (current source)

### 2. **Custom Filming**
- Hire local videographer in Mozambique
- Capture actual Barra Cabanas properties
- Film guest experiences and activities
- Drone footage of coastline and properties

### 3. **Luxury Resort Collections**
- License footage from similar luxury resorts
- Partner with Mozambique tourism board
- Collaborate with local hospitality businesses

## Optimization Process

### 1. **Video Compression**
```bash
# Using FFmpeg for optimization
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart output.mp4
```

### 2. **Web Optimization**
- Enable fast start (moov atom at beginning)
- Progressive download support
- Multiple quality versions for different connections
- Lazy loading implementation

### 3. **Performance Considerations**
- Preload metadata only
- Smooth transitions between videos
- Mobile fallback to static images
- CDN delivery for global performance

## Implementation Notes

### Current Features
✅ Seamless video transitions
✅ Mobile optimization (videos disabled on mobile)
✅ Smooth opacity transitions
✅ Automatic playlist cycling
✅ Performance-optimized loading

### Future Enhancements
- [ ] Multiple quality versions (adaptive streaming)
- [ ] Geolocation-based video selection
- [ ] Seasonal content rotation
- [ ] User preference settings
- [ ] Analytics tracking for video engagement

## File Organization

```
public/
├── videos/
│   ├── hero/
│   │   ├── ocean-waves-1080p.mp4
│   │   ├── beach-walk-1080p.mp4
│   │   ├── luxury-dining-1080p.mp4
│   │   ├── dolphins-swimming-1080p.mp4
│   │   └── sunset-views-1080p.mp4
│   └── mobile-fallbacks/
│       ├── ocean-waves-poster.jpg
│       ├── beach-walk-poster.jpg
│       └── luxury-dining-poster.jpg
```

## Budget Considerations

### Stock Video Licensing
- **Pexels**: Free (current)
- **Shutterstock**: $29-199/video
- **Getty Images**: $50-500/video
- **Adobe Stock**: $79.99/month subscription

### Custom Production
- **Local videographer**: $500-2000/day
- **Drone footage**: $300-800/day
- **Post-production**: $50-150/hour
- **Total custom package**: $2000-5000

## Next Steps

1. **Immediate**: Current Pexels videos are working well
2. **Short-term**: Add 2-3 more videos to playlist
3. **Medium-term**: Consider custom filming at actual properties
4. **Long-term**: Implement adaptive streaming and analytics
