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

    def send_keys_name(self, name):
        '''Send text to the name input HTML element
        
        Args:
            path: Path location
        '''

        id = "input-name-id"
        self.driver.send_keys_by_id(id, name)

    def click_save_button(self):
        '''Click on the save button'''

        pass
