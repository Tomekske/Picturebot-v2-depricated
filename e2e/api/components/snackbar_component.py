class Snackbar():  
    '''Class to model the snackbar component'''

    def __init__(self, driver):
        '''Snackbar constructor
        
        Args:
            driver: Driver object
        '''

        self.driver = driver
        self.class_name = "snackbar-id"
    
    def is_snackbar_visible(self):
        '''Check wether the snackbar is visible'''

        return self.driver.is_element_visible_by_class_name(self.class_name)

    def get_text(self):
        '''Get the text within the snackbar'''
        
        xpath = f"//*[contains(@class, '{self.class_name}')]/simple-snack-bar/span"
        return self.driver.get_value_by_xpath(xpath)
