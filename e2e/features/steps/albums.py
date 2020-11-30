from behave import *
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException  
from selenium.common.exceptions import TimeoutException  
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By

def click(driver, selector):
    # element = driver.find_element_by_css_selector(selector)
    element = WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.ID, selector)))
    element.click()

def isSelector(driver, selector):
    return True if driver.find_elements_by_css_selector(selector) else False

@given('Application is loaded')
def page_is_loaded(ctx):
    try:
        element_present = EC.presence_of_element_located((By.Id, 'body'))
        WebDriverWait(ctx.driver, 3).until(element_present)
    except TimeoutException:
        print("Timed out waiting for page to load")
    finally:
        print("Page loaded")



@given('Run application')
def run_application(ctx):
    exe = r"C:\Users\joost\AppData\Local\Programs\Picturebot\Picturebot.exe"

    options = webdriver.ChromeOptions()
    options.binary_location = exe

    ctx.driver = webdriver.Chrome(chrome_options=options)




@when('I click on the add new album button')
def click_add_new_album_button(ctx):
    print("whoopwhoop")
    selector = "#test-open-album-id"

    #pageLoaded(ctx.driver)
    # if(isSelector(ctx.driver, selector)):
    #     print("BESTAAT")
    #     click(ctx.driver, selector)
    #     pass
    # else:
    #     print("NIEEER")

@then('Close application')
def step_impl(ctx):
    print("Closing")
    ctx.driver.close()