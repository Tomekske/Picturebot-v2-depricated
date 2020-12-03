from behave import *
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException  
from selenium.common.exceptions import TimeoutException  
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By

class Driver:
    '''Class with low level methods to interact with selenium'''

    def __init__(self, chromedriver, application):
        '''Driver constructor
        
        Args:
            chromedriver: Path to the chromedriver's exe
            application: Path to the picturebot's exe
        '''

        self.chromedriver = chromedriver
        self.application = application

        self.__open()

    def __open(self):
        '''Open the application'''

        options = webdriver.ChromeOptions()
        options.binary_location = self.application

        self.driver = webdriver.Chrome(executable_path = self.chromedriver, chrome_options = options)

    def click_by_xpath(self, xpath):
        '''Click on an element by xpath'''

        element = self.driver.find_element_by_xpath(xpath)
        element = WebDriverWait(self.driver, 5).until(EC.visibility_of_element_located((By.XPATH, xpath)))
        element.click()

    def click_by_id(self, id):
        '''Click on an element by id'''

        element = self.driver.find_element_by_id(id)
        element = WebDriverWait(self.driver, 5).until(EC.visibility_of_element_located((By.ID, id)))
        element.click()

    def close(self):
        '''Close the application'''

        self.driver.close()

    def send_keys_by_id(self, id, text):
        '''Send text to an element by id'''

        self.driver.find_element(By.ID, id).send_keys(text)
