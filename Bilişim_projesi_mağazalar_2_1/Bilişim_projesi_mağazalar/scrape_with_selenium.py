from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
import os
import requests

# Directory to save images
SAVE_DIR = "selenium_product_images"
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

def scrape_product_images(target_urls):
    """Scrape product images from a dynamic website using Selenium."""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver_path = "chromedriver.exe"  # Path to ChromeDriver
    service = Service(driver_path)
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        for url in target_urls:
            try:
                driver.get(url)
                print(f"Scraping images from: {url}")
                image_elements = driver.find_elements(By.TAG_NAME, "img")
                print(f"Found {len(image_elements)} images.")

                for idx, img in enumerate(image_elements):
                    img_url = img.get_attribute("src")
                    if img_url:
                        save_path = os.path.join(SAVE_DIR, f"selenium_image_{idx + 1}.jpg")
                        download_image(img_url, save_path)
            except Exception as e:
                print(f"An error occurred while processing {url}: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    target_urls = [
        "https://www.trendyol.com/asus/tuf-gaming-f15-fx506hf-bq003-intel-core-i5-11400h-16gb-512gb-ssd-rtx2050-btfs-15-6-inc-fhd-144hz-freedos-tasinabilir-bilgisayar-p-347603782",
        "https://www.trendyol.com/lenovo/v14-g2-intel-core-i3-11th-gen-8gb-256gb-ssd-tasinabilir-bilgisayar-p-352657336",
        "https://www.trendyol.com/apple/iphone-13-128gb-midyeci-p-360580080"
    ]
    scrape_product_images(target_urls)