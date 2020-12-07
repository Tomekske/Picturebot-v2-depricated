class LibraryPage:
    '''Class to model the library page'''

    def __init__(self, driver):
        '''LibraryPage constructor
        
        Args:
            driver: Driver object
        '''

        self.driver = driver

    def send_keys_library(self, path):
        '''Send text to the library input HTML element
        
        Args:
            path: Path location
        '''

        id = "input-base-id"
        self.driver.send_keys_by_id(id, path)

    def send_keys_name(self, text):
        '''Send text to the name input HTML element
        
        Args:
            text: Text which is send to the element
        '''

        id = "input-name-id"
        self.driver.send_keys_by_id(id, text)

    def click_save_button(self):
        '''Click on the save button'''
        
        id = "btn-submit-form-library-id"
        self.driver.click_by_id(id)  
