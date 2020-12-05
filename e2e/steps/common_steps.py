from e2e.api.components.menu_component import Menu
from behave import *
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException  
from selenium.common.exceptions import TimeoutException  
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from e2e.api.driver import Driver
import time
import json
import os

@given('Run application')
def run_application(ctx):
    with open(r'e2e\resources\config.json') as f:
        data = json.load(f)
        ctx.driver = Driver(data["chromedriver"], data["application"])

@then('Close application')
def close_application(ctx):
    ctx.driver.close()

@then('I wait "{seconds}" seconds')
def wait_seconds(ctx, seconds):
    time.sleep(int(seconds))
