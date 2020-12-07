class Error():  
    '''Class to model the validation error component'''

    def __init__(self, driver, id):
        '''Menu constructor
        
        Args:
            driver: Driver object
            id: Id of the error message component
        '''

        self.driver = driver
        self.id = id

    def is_error_visible(self):
        '''Check wether the error message is visible'''

        return self.driver.is_element_visible_by_id(self.id)

    def get_error_message(self):
        '''Get the error message'''
        
        return self.driver.get_value_by_id(self.id)
