from e2e.api.components.menu_component import Menu
from e2e.api.components.snackbar_component import Snackbar
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
import time
import shutil 

@given('I read settings file')
def cleanup_library(ctx):
    with open(r'e2e\resources\config.json') as f:
        ctx.data = json.load(f)

@Then('I cleanup workspace')
def cleanup_library(ctx):
    workspace = ctx.data["workspace"]
    database = ctx.data["database"]

    # Delete Library on the hard-disk
    if os.path.isdir(workspace):
        shutil.rmtree(workspace)
        os.mkdir(workspace)
    else: 
        os.mkdir(workspace)

    # Delete database file
    if os.path.exists(database):
        os.remove(database)

@then('Run application')
def run_application(ctx):
    ctx.driver = Driver(ctx.data["chromedriver"], ctx.data["application"])

@then('Close application')
def close_application(ctx):
    ctx.driver.close()

@then('I wait "{seconds}" seconds')
def wait_seconds(ctx, seconds):
    time.sleep(int(seconds))

@then('I check whether the error snackbar is displayed')
def check_snackbar_is_displayed(ctx):
    assert Snackbar(ctx.driver).is_snackbar_visible() == True, "snackbar isn't visible"

@then('I check whether the snackbar contains the text "{expected}"')
def check_whether_snackbar_contains_text(ctx, expected):
    actual = Snackbar(ctx.driver).get_text()

    assert actual == expected, f"'{expected}' doesn't equal '{actual}'"
