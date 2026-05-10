import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

# --- CONFIGURATION ---
AZURE_LIVE_URL = "https://poc-urbangrowth.ashybush-4248957c.centralindia.azurecontainerapps.io" # REPLACE WITH YOUR ACTUAL LIVE URL
DEVELOPER_NAME = "Ananthu Anil"

def run_uat_audit():
    # Setup Chrome Options
    chrome_options = Options()
    # chrome_options.add_argument("--headless") # Enable after manual verification
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")

    # Initialize WebDriver
    # Note: Ensure chromedriver is in your PATH or specify service path
    driver = webdriver.Chrome(options=chrome_options)
    wait = WebDriverWait(driver, 15)
    
    results = []

    try:
        print(f"🚀 Starting UAT Audit for: {AZURE_LIVE_URL}")
        driver.get(AZURE_LIVE_URL)

        # TEST CASE 1: Visual Load
        try:
            # Verify background (Checking main container background color or specific class)
            main_element = wait.until(EC.presence_of_element_located((By.TAG_NAME, "main")))
            # Check for map container
            map_container = driver.find_element(By.CLASS_NAME, "leaflet-container")
            
            if main_element and map_container.is_displayed():
                results.append("TC1 (Visual Load): PASS - Map and Cinematic framework initialized.")
            else:
                results.append("TC1 (Visual Load): FAIL - Map container not visible.")
        except Exception as e:
            results.append(f"TC1 (Visual Load): FAIL - {str(e)}")

        # TEST CASE 2: The Handshake (Marker Click -> Panel Slide)
        try:
            # Wait for markers to load (Leaflet interactive paths)
            marker = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "leaflet-interactive")))
            marker.click()
            print("🖱️ Marker clicked. Verifying Intelligence Panel...")
            
            # Check if panel is visible and has the 'open' class
            panel = wait.until(EC.presence_of_element_located((By.ID, "intelligence-panel")))
            time.sleep(1) # Allow for slide animation
            
            if "open" in panel.get_attribute("class"):
                results.append("TC2 (The Handshake): PASS - Intelligence Panel successfully triggered via marker.")
            else:
                results.append("TC2 (The Handshake): FAIL - Panel did not slide open.")
        except Exception as e:
            results.append(f"TC2 (The Handshake): FAIL - {str(e)}")

        # TEST CASE 3: The Signature (Info Modal -> Developer Name)
        try:
            # Click Info Icon
            info_btn = wait.until(EC.element_to_be_clickable((By.ID, "info-trigger")))
            info_btn.click()
            print("🖱️ Info icon clicked. Verifying Signature...")
            
            # Verify Name in Modal
            name_el = wait.until(EC.presence_of_element_located((By.ID, "developer-name")))
            found_name = name_el.text
            
            if found_name == DEVELOPER_NAME:
                results.append(f"TC3 (The Signature): PASS - Developer name '{DEVELOPER_NAME}' verified.")
            else:
                results.append(f"TC3 (The Signature): FAIL - Expected '{DEVELOPER_NAME}' but found '{found_name}'.")
        except Exception as e:
            results.append(f"TC3 (The Signature): FAIL - {str(e)}")

    finally:
        # Generate Report
        print("\n📝 Generating Test_Report.txt...")
        with open("Test_Report.txt", "w") as f:
            f.write("=== REAL RAILS UAT AUDIT REPORT ===\n")
            f.write(f"TIMESTAMP: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"TARGET_URL: {AZURE_LIVE_URL}\n")
            f.write("-" * 35 + "\n")
            for result in results:
                f.write(result + "\n")
                print(result)
            f.write("-" * 35 + "\n")
            f.write("STATUS: COMPLETED\n")
        
        driver.quit()
        print("✅ Audit Complete. Report saved to Test_Report.txt")

if __name__ == "__main__":
    run_uat_audit()
