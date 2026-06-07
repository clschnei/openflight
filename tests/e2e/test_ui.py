import subprocess
import time
import urllib.error
import urllib.request

import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(scope="session", autouse=True)
def start_server():
    print("Starting mock server...")
    process = subprocess.Popen(
        ["scripts/start-kiosk.sh", "--mock", "--port", "8080"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    # Wait for the server to be ready
    for _ in range(30):
        try:
            response = urllib.request.urlopen("http://localhost:8080")
            if response.getcode() == 200:
                print("Mock server is ready.")
                break
        except urllib.error.URLError:
            time.sleep(1)
    else:
        process.terminate()
        process.wait()
        raise RuntimeError("Failed to start mock server")

    yield

    print("Stopping mock server...")
    process.terminate()
    process.wait()


def test_homepage_loads(page: Page):
    page.goto("http://localhost:8080")
    # Verify the title is "ui" as set in index.html
    expect(page).to_have_title("ui")

    # Check that some core elements are rendered
    # We wait for the main content to appear. The club dialog or "Connected" text is present.
    expect(page.locator("text=Connected").first).to_be_visible(timeout=10000)


def test_mock_shot(page: Page):
    page.goto("http://localhost:8080")

    # Wait for the club selection to be visible, then click a club to dismiss it
    # We'll just click "7i" for example
    page.locator("button:has-text('7i')").click()

    # Click the "Simulate Shot" button
    simulate_button = page.locator("button:has-text('Simulate Shot')")
    expect(simulate_button).to_be_visible(timeout=10000)
    simulate_button.click()

    # The mock shot generates data like Ball Speed. We expect text like "mph" to show up.
    expect(page.locator("text=BALL SPEED").first).to_be_visible(timeout=10000)
    expect(page.locator("text=mph").first).to_be_visible(timeout=10000)
