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
        '''Click on an element by xpath
        
        Args:
            xpath: Xpath of an element
        '''

        element = self.driver.find_element_by_xpath(xpath)
        element = WebDriverWait(self.driver, 5).until(EC.visibility_of_element_located((By.XPATH, xpath)))
        element.click()

    def click_by_class_name(self, class_name):
        '''Click on an element by class name
        
        Args:
            class_name: Class name of an element
        '''

        element = self.driver.find_element_by_class_name(class_name)
        element = WebDriverWait(self.driver, 5).until(EC.visibility_of_element_located((By.CLASS_NAME, class_name)))
        element.click()

    def click_by_id(self, id):
        '''Click on an element by id
        
        Args:
            id: Id name of an element
        '''

        element = self.driver.find_element_by_id(id)
        element = WebDriverWait(self.driver, 5).until(EC.visibility_of_element_located((By.ID, id)))
        element.click()

    def get_value_by_xpath(self, xpath):
        '''Get the value of an element by xpath
        
        Args:
            xpath: Xpath of an element
        '''

        return self.driver.find_element_by_xpath(xpath).text

    def get_value_by_id(self, id):
        '''Get the value of an element by id
        
        Args:
            xpath: Xpath of an element
        '''

        return self.driver.find_element_by_id(id).text

    def close(self):
        '''Close the application'''

        self.driver.close()

    def send_keys_by_id(self, id, text):
        '''Send text to an element by id
        
        Args:
            id: Id name of an element
            text: Text which is send to the element
        '''

        self.driver.find_element(By.ID, id).send_keys(text)

    def is_element_visible_by_class_name(self, class_name):
        '''Check wether an element is visible by class name
        
        Args:
            class_name: Class name of an element
        '''

        element = self.driver.find_element_by_class_name(class_name)
        return element.is_displayed()

    def is_element_visible_by_id(self, id):
        '''Check wether an element is visible by id
        
        Args:
            class_name: Class name of an element
        '''

        element = self.driver.find_element_by_id(id)
        return element.is_displayed()
