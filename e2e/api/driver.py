from behave import *
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException  
from selenium.common.exceptions import TimeoutException  
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By

class Driver: 
    def __init__(self, chromedriver, executable):
        self.chromedriver = chromedriver
        self.executable = executable

        self.__open()

    def __open(self):
        options = webdriver.ChromeOptions()
        options.binary_location = self.executable

        self.driver = webdriver.Chrome(executable_path = self.chromedriver, chrome_options = options)

    def click_by_xpath(self, xpath):
        element = self.driver.find_element_by_xpath(xpath)
        element = WebDriverWait(self.driver, 5).until(EC.visibility_of_element_located((By.XPATH, xpath)))
        element.click()

    def click_by_id(self, id):
        element = self.driver.find_element_by_id(id)
        element = WebDriverWait(self.driver, 5).until(EC.visibility_of_element_located((By.ID, id)))
        element.click()

    def close(self):
        self.driver.close()

    def send_keys_by_id(self, id, text):
        self.driver.find_element(By.ID, id).send_keys(text)
