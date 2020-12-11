class CollectionPage:
    '''Class to model the collection page'''

    def __init__(self, driver):
        '''CollectionPage constructor
        
        Args:
            driver: Driver object
        '''

        self.driver = driver

    def click_save_button(self):
        '''Click on the save button'''
        
        id = "btn-save-form-collection-id"
        self.driver.click_by_id(id)
