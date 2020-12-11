from e2e.api.components.dropdown_component import Dropdown
from e2e.api.pages.collection_page import CollectionPage
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

@then('I click on the add new collection button')
def click_add_new_collection_button(ctx):
    menu = Menu(ctx.driver)
    menu.click_add_collection_item()

@then('I click on the save collection button')
def click_save_library_button(ctx):
    page = CollectionPage(ctx.driver)
    page.click_save_button()

@then('Collection page: I check the library selector for error messages "{expected}"')
def check_library_selector_for_error_messages(ctx, expected):
    id = "error-library-id"
    actual = Error(ctx.driver, id).get_error_message()

    assert actual == expected, f"'{actual}' doesn't equal '{expected}'"

@then('Collection page: I check the base input for error messages "{expected}"')
def check_base_input_for_error_messages(ctx, expected):
    id = "error-base-id"
    actual = Error(ctx.driver, id).get_error_message()

    assert actual == expected, f"'{actual}' doesn't equal '{expected}'"

@then('Collection page: I check the name input for error messages "{expected}"')
def check_name_input_for_error_messages(ctx, expected):
    id = "error-name-id"
    actual = Error(ctx.driver, id).get_error_message()

    assert actual == expected, f"'{actual}' doesn't equal '{expected}'"

@then('Collection page: I check the preview input for error messages "{expected}"')
def check_preview_input_for_error_messages(ctx, expected):
    id = "error-preview-id"
    actual = Error(ctx.driver, id).get_error_message()

    assert actual == expected, f"'{actual}' doesn't equal '{expected}'"

@then('Collection page: I check the backup input for error messages "{expected}"')
def check_backup_input_for_error_messages(ctx, expected):
    id = "error-backup-id"
    actual = Error(ctx.driver, id).get_error_message()

    assert actual == expected, f"'{actual}' doesn't equal '{expected}'"

@then('Collection page: I check the files input for error messages "{expected}"')
def check_files_input_for_error_messages(ctx, expected):
    id = "error-files-id"
    actual = Error(ctx.driver, id).get_error_message()

    assert actual == expected, f"'{actual}' doesn't equal '{expected}'"

@then('Collection page: I check the favorites input for error messages "{expected}"')
def check_favorites_input_for_error_messages(ctx, expected):
    id = "error-favorites-id"
    actual = Error(ctx.driver, id).get_error_message()

    assert actual == expected, f"'{actual}' doesn't equal '{expected}'"

@then('Collection page: I check the edited input for error messages "{expected}"')
def check_edited_input_for_error_messages(ctx, expected):
    id = "error-edited-id"
    actual = Error(ctx.driver, id).get_error_message()

    assert actual == expected, f"'{actual}' doesn't equal '{expected}'"

@then('Collection page: I check the socialMedia input for error messages "{expected}"')
def check_socialMedia_input_for_error_messages(ctx, expected):
    id = "error-socialMedia-id"
    actual = Error(ctx.driver, id).get_error_message()

    assert actual == expected, f"'{actual}' doesn't equal '{expected}'"

@then('Collection page: I check whether the dropdown is disabled')
def check_whether_dropdown_is_disabled(ctx):
    id = "select-library-id"

    assert Dropdown(ctx.driver, id).is_disabled() == True, f"'Dropdown is not disabled'"
