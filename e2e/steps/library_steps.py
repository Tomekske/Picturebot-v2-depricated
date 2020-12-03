from e2e.api.pages.library_page import LibraryPage
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

import os
import time 

@when('I click on the add new library button')
def click_add_new_album_button(ctx):
    menu = Menu(ctx.driver)
    menu.click_add_library_item()
    time.sleep(10)

@then('I enter text "{text}" within the library input')
def enter_text_library_input(ctx, text):
    page = LibraryPage(ctx.driver)
    page.send_keys_library(text)

@then('I enter text "{text}" within the name input')
def enter_text_name_input(ctx, text):
    page = LibraryPage(ctx.driver)
    page.send_keys_name(text)
