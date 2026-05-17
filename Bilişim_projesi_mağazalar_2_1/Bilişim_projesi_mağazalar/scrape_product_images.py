import requests
from bs4 import BeautifulSoup
import os

# Directory to save images
SAVE_DIR = "product_images"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

def download_image(image_url, save_path):
    """Downloads and saves an image from a given URL."""
    try:
        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            with open(save_path, 'wb') as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
            print(f"Image saved: {save_path}")
        else:
            print(f"Failed to download image: {image_url}")
    except Exception as e:
        print(f"Error downloading {image_url}: {e}")

def scrape_product_images(url):
    """Scrape product images from a web page URL."""
    try:
        # Request the page
        response = requests.get(url, verify=False)
        response.raise_for_status()

        # Parse HTML content
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find image tags
        image_tags = soup.find_all('img')
        print(f"Found {len(image_tags)} images.")

        # Download images
        for index, img in enumerate(image_tags):
            img_url = img.get('src')
            if img_url:
                # Resolve relative URLs
                if not img_url.startswith(('http:', 'https:')):
                    img_url = requests.compat.urljoin(url, img_url)

                save_path = os.path.join(SAVE_DIR, f"image_{index + 1}.jpg")
                download_image(img_url, save_path)
    
    except Exception as e:
        print(f"Error scraping images from {url}: {e}")

if __name__ == "__main__":
    # Replace with the URL of your target webpage
    target_url = "https://example.com"  # TODO: Update this to the desired website.
    scrape_product_images(target_url)