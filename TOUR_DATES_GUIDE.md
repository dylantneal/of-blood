# Tour Dates Editing Guide

## Quick Access

Visit `/admin/tour` on your website to access the Tour Dates Admin page.

**🔒 Password Protection**: The admin page is password-protected. You'll be redirected to `/admin/login` if not authenticated.

## Setup

1. **Set Admin Password**: Add `ADMIN_PASSWORD` to your `.env.local` file:
   ```
   ADMIN_PASSWORD=your-secure-password-here
   ```

2. **Login**: Visit `/admin/login` and enter your password to access the admin panel.

## How to Edit Tour Dates

### Using the Admin Page (Recommended)

1. **Navigate to Admin Page**
   - Go to `http://localhost:3000/admin/tour` (or your domain + `/admin/tour`)
   - The page will automatically load your current tour dates

2. **Edit Shows**
   - Click on any show card to edit its details
   - Fill in the required fields:
     - **Date** (required): Use the date picker
     - **City** (required): Enter the city name
     - **State** (optional): Enter state abbreviation (e.g., "CA")
     - **Venue** (required): Enter the venue name
     - **Ticket URL** (optional): Full URL to ticket sales page
     - **On Sale**: Check if tickets are currently available
     - **Sold Out**: Check if the show is sold out

3. **Add New Shows**
   - Click the "Add Show" button
   - Fill in the details for the new show
   - The show will be added to your list

4. **Delete Shows**
   - Click the trash icon on any show card to remove it

5. **Save Changes**
   - Click "Copy JSON" to copy the formatted JSON
   - Open `data/shows.json` in your code editor
   - Replace the entire file contents with the copied JSON
   - Save the file
   - Your changes will appear on the site after refresh

### Manual Editing (Alternative)

You can also edit `data/shows.json` directly. Here's the format:

```json
[
  {
    "id": "1",
    "date": "2025-12-15",
    "city": "Los Angeles",
    "state": "CA",
    "venue": "The Roxy Theatre",
    "ticketUrl": "https://example.com/tickets",
    "onSale": true,
    "isSoldOut": false
  }
]
```

**Field Descriptions:**
- `id`: Unique identifier (can be any string, numbers work fine)
- `date`: Date in YYYY-MM-DD format (e.g., "2025-12-15")
- `city`: City name (required)
- `state`: State abbreviation, optional (e.g., "CA", "NY")
- `venue`: Venue name (required)
- `ticketUrl`: Full URL to ticket sales page (optional)
- `onSale`: `true` if tickets are available, `false` otherwise (optional, defaults to false)
- `isSoldOut`: `true` if sold out, `false` otherwise (optional, defaults to false)

## Where Tour Dates Appear

- **Home Page**: Shows upcoming shows (only future dates) in the Tour Ticker section
- **Tour Page** (`/tour`): Shows all tour dates with full details

## Tips

- Dates are automatically sorted chronologically
- Only future dates appear on the home page tour ticker
- Make sure dates are in the future for them to show as "upcoming"
- Use the "On Sale" checkbox to control ticket button visibility
- Use "Sold Out" to mark shows that are no longer available

