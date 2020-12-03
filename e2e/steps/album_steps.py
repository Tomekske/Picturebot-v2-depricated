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

@when('I click on the add new album button')
def click_add_new_album_button(ctx):
    menu = Menu(ctx.driver)
    menu.click_add_album_item()
    #ctx.driver.click_menu_item("add_album_item")
