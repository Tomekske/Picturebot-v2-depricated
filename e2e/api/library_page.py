class LibraryPage:
    def __init__(self, driver):
        self.driver = driver

    def send_keys_library(self, path):
        id = "input-base-id"
        self.driver.send_keys_by_id(id, path)

    def send_keys_name(self, name):
        id = "input-name-id"
        self.driver.send_keys_by_id(id, name)

    def click_save_button(self):
        pass
