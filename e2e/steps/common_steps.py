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

@given('Run application')
def run_application(ctx):
    print("loool")
    exe = r"D:\Programs\Development\Picturebot\release\win-unpacked\Picturebot.exe"
    chromedriver = r"C:\Users\joost\Documents\Chromedriver\chromedriver.exe"

    ctx.driver = Driver(chromedriver, exe)

@then('Close application')
def close_application(ctx):
    print("Closinnnnnnnnnnnnnnnng")
    ctx.driver.close()

@then('I wait "{seconds}" seconds')
def wait_seconds(ctx, seconds):
    time.sleep(int(seconds))