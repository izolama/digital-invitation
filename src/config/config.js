const config = {
  data: {
    // Main invitation title that appears on the page
    title: "Digital Invitation",
    // Opening message/description of the invitation
    description:
      "Kami mengundang Anda untuk turut merayakan momen istimewa ini.",
    // Event organizer/company name
    groomName: "Customer Gathering 2025",
    // Event theme/title
    brideName: "STEEL IN HARMONY",
    // Event organizer details
    parentGroom: "PT Krakatau Baja Industri",
    // Additional event information
    parentBride: "Event Organizer",
    // Event date (format: YYYY-MM-DD)
    date: "2025-12-05",
    // Google Maps link for location (short clickable link)
    maps_url: "https://maps.app.goo.gl/KJHSDw5cBf6MKmU27",
    // Google Maps embed code to display map on website
    // How to get: open Google Maps → select location → Share → Embed → copy link
    maps_embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0000000000005!2d106.8270733147699!3d-6.175392995514422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4f1b6d7b1e7%3A0x2e69f4f1b6d7b1e7!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1633666820004!5m2!1sid!2sid",
    // Event time (free format, example: "10:00 - 12:00 WIB")
    time: "18:00 - 22:00 WIB",
    // Venue/building name
    location: "SHANGRI-LA HOTEL JAKARTA",
    // Full address of the event venue
    address: "Jl. Jend. Sudirman No.1, Jakarta",
    // Image that appears when link is shared on social media
    ogImage: "/images/og-image.jpg",
    // Icon that appears in browser tab
    favicon: "/images/favicon.ico",
    // List of event agenda/schedule
    agenda: [
      {
        // First event name
        title: "Opening Ceremony",
        // Event date (format: YYYY-MM-DD)
        date: "2025-12-05",
        // Start time (format: HH:MM)
        startTime: "18:00",
        // End time (format: HH:MM)
        endTime: "19:00",
        // Event venue
        location: "Grand Ballroom, Shangri-La Hotel",
        // Full address
        address: "Jl. Jend. Sudirman No.1, Jakarta",
      },
      {
        // Second event name
        title: "Main Event",
        date: "2025-12-05",
        startTime: "19:00",
        endTime: "22:00",
        location: "Grand Ballroom, Shangri-La Hotel",
        address: "Jl. Jend. Sudirman No.1, Jakarta",
      }
      // You can add more agenda items with the same format
    ],

    // Background music settings
    audio: {
      // Music file (choose one or replace with your own file)
      src: "/audio/fulfilling-humming.mp3", // or /audio/nature-sound.mp3
      // Music title to display
      title: "Fulfilling Humming", // or Nature Sound
      // Whether music plays automatically when website opens
      autoplay: true,
      // Whether music repeats continuously
      loop: true
    },

    // List of bank accounts (optional, for donations or payments)
    banks: [
      {
        // Bank name
        bank: "Bank Central Asia",
        // Account number
        accountNumber: "1234567890",
        // Account holder name (all uppercase)
        accountName: "EVENT ORGANIZER",
      },
      {
        bank: "Bank Mandiri",
        accountNumber: "0987654321",
        accountName: "EVENT ORGANIZER",
      }
      // You can add more banks with the same format
    ]
  }
};

export default config;