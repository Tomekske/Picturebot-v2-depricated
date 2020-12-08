from e2e.api.pages.library_page import LibraryPage
from e2e.api.components.menu_component import Menu
from e2e.api.components.snackbar_component import Snackbar
from e2e.api.components.error_component import Error
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
import shutil 
import sqlite3

@then('I click on the add new library button')
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

@then('I click on the save library button')
def click_save_library_button(ctx):
    page = LibraryPage(ctx.driver)
    page.click_save_button()

@then('Library page: I check the base input for error messages "{expected}"')
def check_base_input_for_error_messages(ctx, expected):
    id = "error-base-id"
    actual = Error(ctx.driver, id).get_error_message()

    assert actual == expected, f"'{actual}' doesn't equal '{expected}'"

@then('Library page: I check the name input for error messages "{expected}"')
def check_name_input_for_error_messages(ctx, expected):
    id = "error-name-id"
    actual = Error(ctx.driver, id).get_error_message()

    assert actual == expected, f"'{actual}' doesn't equal '{expected}'"

@then('I check wether the library "{expected}" is saved in the database')
def check_wether_library_is_in_databse(ctx, expected):
    # Delete data from database
    conn = sqlite3.connect(ctx.data["database"])

    cur = conn.cursor()
    cur.execute(f'SELECT library FROM library WHERE library = "{expected}"')
    actual = cur.fetchone()[0]

    assert actual == expected, f"'{actual}' doesn't equal '{expected}'"
    conn.close()
