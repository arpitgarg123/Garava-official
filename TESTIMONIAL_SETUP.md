# Testimonial System Environment Variables Configuration

## Add these to your server/.env file:

# Google Places API for Testimonials (Required for Google Reviews Import)
GOOGLE_API_KEY="YOUR_GOOGLE_PLACES_API_KEY_HERE"
GOOGLE_PLACE_ID="YOUR_GOOGLE_BUSINESS_PLACE_ID_HERE"

## How to get these values:

### 1. Google API Key:
1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable "Places API" 
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key and paste it as GOOGLE_API_KEY value

### 2. Google Place ID:
1. Go to Google Place ID Finder (https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for your business name
3. Copy the Place ID and paste it as GOOGLE_PLACE_ID value

### Example:
GOOGLE_API_KEY="AIzaSyBvOkBwgGlbUiuS-oNma-StxVnHnHiOEBw"
GOOGLE_PLACE_ID="ChIJN1t_tDeuEmsRUsoyG83frY4"

Once configured, the "Fetch Google" button will automatically import reviews from your Google Business Profile without requiring manual input each time.