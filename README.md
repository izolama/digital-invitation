# Digital Invitation

![Preview](public/preview.png)

A modern, interactive digital invitation website that can be customized for any event - weddings, corporate gatherings, birthdays, anniversaries, and more. Built with Vite (React), Tailwind CSS, and Framer Motion.

Based on the original template by [@mrofisr](https://github.com/mrofisr).

## Features
- 🎨 Modern design & smooth animations
- 📱 Fully responsive & mobile-first layout
- 🎵 Background music with autoplay control
- 🎉 Fun confetti effects and countdown timer
- 📍 Google Maps integration
- 💳 Digital envelope/gift feature with bank account details
- 📅 Multiple event agenda support
- 🌐 SEO optimized with Open Graph tags
- ⚡ Lightning-fast performance with Vite
- 🎯 Easy customization through single config file

## Use Cases
This template is perfect for:
- 💍 Wedding invitations
- 🎂 Birthday celebrations
- 🎓 Graduation parties
- 🏢 Corporate events & gatherings
- 🎊 Anniversary celebrations
- 🎪 Any special event that needs a digital invitation

## Tech Stack
- [Vite (React)](https://vite.dev/) - Fast build tool and dev server
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library
- [React Confetti](https://www.npmjs.com/package/react-confetti) - Celebration effects

## Installation
1. Clone the repository and install dependencies:
  ```bash
  git clone https://github.com/yourusername/digital-invitation
  cd digital-invitation
  npm install
  ```
2. Update your event details in `src/config/config.js`.
3. Start the development server:
  ```bash
  npm run dev
  ```
  Open [http://localhost:5173/](http://localhost:5173/) in your browser.

## Customization

### Basic Setup
Edit `src/config/config.js` to customize your digital invitation. Here's what you can configure:

#### Event Information
```javascript
const config = {
  data: {
    // Main invitation title that appears on the page
    title: "Your Event Title",
    
    // Opening message/description of the invitation
    description: "Join us to celebrate this special moment together.",
    
    // Primary person/entity name (e.g., groom, birthday person, company)
    groomName: "Host Name / Company",
    
    // Secondary person/entity name (e.g., bride, co-host, event theme)
    brideName: "Co-Host / Event Theme",
    
    // Additional context (optional - can be parents, organizers, sponsors)
    parentGroom: "Organizer / Sponsor 1",
    parentBride: "Organizer / Sponsor 2",
```

#### Date, Time & Location
```javascript
    // Event date (format: YYYY-MM-DD)
    date: "2025-12-31",
    
    // Event time (free format, example: "10:00 - 12:00 WIB")
    time: "19:00 - 22:00 WIB",
    
    // Venue/building name
    location: "Grand Ballroom, Luxury Hotel",
    
    // Full address of the event venue
    address: "Jl. Main Street No.123, Your City",
```

#### Google Maps Integration
```javascript
    // Google Maps link for location (short clickable link)
    maps_url: "https://goo.gl/maps/abcdef",
    
    // Google Maps embed code to display map on website
    // How to get: open Google Maps → select location → Share → Embed → copy link
    maps_embed: "https://www.google.com/maps/embed?pb=...",
```

#### Event Agenda
```javascript
    // List of event agenda/schedule (you can add multiple sessions)
    agenda: [
      {
        // Session name (e.g., "Registration", "Main Event", "Ceremony")
        title: "Registration & Welcome",
        // Session date (format: YYYY-MM-DD)
        date: "2025-12-31",
        // Start time (format: HH:MM)
        startTime: "18:30",
        // End time (format: HH:MM)
        endTime: "19:00",
        // Session venue
        location: "Main Lobby",
        // Full address
        address: "Jl. Main Street No.123, Your City",
      },
      {
        title: "Main Event",
        date: "2025-12-31",
        startTime: "19:00",
        endTime: "21:00",
        location: "Grand Ballroom",
        address: "Jl. Main Street No.123, Your City",
      },
      // You can add more agenda items with the same format
    ],
```

#### Background Music
```javascript
    // Background music settings
    audio: {
      // Music file (choose one or replace with your own file)
      src: "/audio/fulfilling-humming.mp3", // or /audio/nature-sound.mp3
      // Music title to display
      title: "Fulfilling Humming",
      // Whether music plays automatically when website opens
      autoplay: true,
      // Whether music repeats continuously
      loop: true
    },
```

#### Digital Envelope/Gift
```javascript
    // List of bank accounts for digital gifts/payments (optional)
    // You can remove this section if not needed for your event
    banks: [
      {
        // Bank name
        bank: "Bank Name",
        // Account number
        accountNumber: "1234567890",
        // Account holder name (all uppercase)
        accountName: "ACCOUNT HOLDER",
      },
      {
        bank: "Another Bank",
        accountNumber: "0987654321",
        accountName: "ACCOUNT HOLDER 2",
      }
      // You can add more banks with the same format
    ]
```

#### SEO & Branding
```javascript
    // Image that appears when link is shared on social media
    ogImage: "/images/og-image.jpg",
    
    // Icon that appears in browser tab
    favicon: "/images/favicon.ico",
```

### Complete Configuration Example

**Example 1: Corporate Event**
```javascript
const config = {
  data: {
    title: "Customer Gathering 2025",
    description: "Join us for an evening of networking and celebration.",
    groomName: "Company Name",
    brideName: "Steel in Harmony",
    parentGroom: "Platinum Sponsor",
    parentBride: "Gold Sponsor",
    date: "2025-12-31",
    maps_url: "https://goo.gl/maps/yourlink",
    maps_embed: "https://www.google.com/maps/embed?pb=...",
    time: "18:00 - 22:00 WIB",
    location: "Grand Ballroom, Luxury Hotel",
    address: "Jl. Business District No.1, Jakarta",
    ogImage: "/images/og-image.jpg",
    favicon: "/images/favicon.ico",
    agenda: [
      {
        title: "Registration",
        date: "2025-12-31",
        startTime: "18:00",
        endTime: "18:30",
        location: "Main Lobby",
        address: "Jl. Business District No.1, Jakarta",
      },
      {
        title: "Networking Session",
        date: "2025-12-31",
        startTime: "18:30",
        endTime: "20:00",
        location: "Grand Ballroom",
        address: "Jl. Business District No.1, Jakarta",
      }
    ],
    audio: {
      src: "/audio/fulfilling-humming.mp3",
      title: "Background Music",
      autoplay: false,
      loop: true
    },
    banks: [] // No payment needed for this event
  }
};

export default config;
```

**Example 2: Wedding Invitation**
```javascript
const config = {
  data: {
    title: "Wedding of John & Jane",
    description: "Together with our families, we invite you to celebrate our wedding.",
    groomName: "John Doe",
    brideName: "Jane Smith",
    parentGroom: "Mr. & Mrs. Doe",
    parentBride: "Mr. & Mrs. Smith",
    date: "2025-06-15",
    time: "14:00 - 17:00 WIB",
    location: "Garden Venue",
    address: "Jl. Beautiful Garden No.10, Bali",
    // ... rest of configuration
  }
};
```
## Deployment

### Option 1: Docker (Recommended)

**Quick Start with Docker:**
```bash
# Create shared network (first time only)
docker network create shared-network

# Development/Testing
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

The application will be available at:
- Development: `http://localhost:8080`
- Production: `http://localhost:80`

📚 **Documentation:**
- 🚀 [QUICKSTART.md](QUICKSTART.md) - Fast deployment guide
- 📖 [DEPLOYMENT.md](DEPLOYMENT.md) - Complete Docker guide with:
- SSL/HTTPS setup
- Production configurations
- Health checks & monitoring
- Troubleshooting
- CI/CD integration

### Option 2: Traditional Hosting

**Building for Production:**
```bash
npm run build
```

The build output will be in the `dist` folder, ready to be deployed.

**Deployment Options:**
- **Vercel**: Connect your GitHub repo and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions to deploy
- **Firebase Hosting**: Deploy with Firebase CLI
- **Any Static Host**: Upload the contents of `dist` folder

### Environment Setup
No environment variables needed - all configuration is in `src/config/config.js`.

## Tips for Best Results

### Performance
- Optimize images before adding them to the `public` folder
- Use WebP format for images when possible
- Keep audio files under 5MB for faster loading

### Customization
- Update the color scheme in `tailwind.config.js`
- Replace fonts in `index.html` for different typography
- Modify animations in component files using Framer Motion

### SEO
- Update `ogImage` with your event's image (1200x630px recommended)
- Set proper `title` and `description` in config for better social sharing
- Add your custom favicon

## License
This project is licensed under the [Apache License 2.0](https://opensource.org/licenses/Apache-2.0). You can use, modify, and distribute it as long as you include the original copyright notice and license.

## Contributing & Support
Contributions and issue reports are welcome! If this project helped you:
- ⭐ Give it a star on GitHub
- 🐛 Report bugs via Issues
- 💡 Suggest new features
- 🔧 Submit pull requests

## Credits
Original template created by [@mrofisr](https://github.com/mrofisr)

## Acknowledgments
This is a versatile adaptation of the original Islamic Wedding Invitation template, made flexible for various event types while maintaining the elegant design and smooth user experience.

---

**Made with ❤️ for your special moments**
