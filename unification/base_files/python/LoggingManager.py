#          ██╗   ██╗██╗  ████████╗██╗███╗   ███╗ █████╗ ████████╗███████╗         
#          ██║   ██║██║  ╚══██╔══╝██║████╗ ████║██╔══██╗╚══██╔══╝██╔════╝         
#          ██║   ██║██║     ██║   ██║██╔████╔██║███████║   ██║   █████╗           
#          ██║   ██║██║     ██║   ██║██║╚██╔╝██║██╔══██║   ██║   ██╔══╝           
#          ╚██████╔╝███████╗██║   ██║██║ ╚═╝ ██║██║  ██║   ██║   ███████╗         
#           ╚═════╝ ╚══════╝╚═╝   ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝         
#                                                                                 
# ██╗   ██╗███╗   ██╗██╗███████╗██╗ ██████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
# ██║   ██║████╗  ██║██║██╔════╝██║██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
# ██║   ██║██╔██╗ ██║██║█████╗  ██║██║     ███████║   ██║   ██║██║   ██║██╔██╗ ██║
# ██║   ██║██║╚██╗██║██║██╔══╝  ██║██║     ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
# ╚██████╔╝██║ ╚████║██║██║     ██║╚██████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
#  ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
# --------------------------------------------------------------------------------
# Ultimate Unification Copyright (C) 2023-2025 under MIT License by:              
#         - MundM2007 (https://github.com/MundM2007)

import os
import time
import traceback
import re
import sys

class LoggingManager:
    # initializes the logging manager and creates the logging files
    def __init__(self, path_program):
        self.start_time = time.time()
        self.content = []
        self.percentage_state_last = -1
        self.percentage_step_last = -1
        self.path_program = path_program
        self.messages_logged = set()

        # creates the log files and directories
        os.makedirs(os.path.join(path_program, "logs"), exist_ok=True)
        self.path_log = os.path.join(path_program, "logs", "latest.log")
        with open(self.path_log, mode="w"):
            pass
        
        # gets the constant log path
        index_logging = 0
        path_constant_log = os.path.join(path_program, "logs", f"log-{time.strftime('%Y-%m-%d', time.gmtime(self.start_time))}-%s.log")
        while True:
            if not os.path.isfile(path_constant_log % index_logging):
                with open(path_constant_log % index_logging, mode="w"):
                    self.path_constant_log = path_constant_log % index_logging
                    break
            index_logging += 1


    # saves the log content to the log files
    def save(self):
        with open(self.path_log, mode="a") as file:
            file.writelines(self.content)
        with open(self.path_constant_log, mode="a") as file:
            file.writelines(self.content)
        self.content = []


    # logs a message to the log files and info messages to the console
    def log(self, type_logging, message, error_name=""): 
        # gets the time and prints info messages
        time_now = round(time.time() - self.start_time, 5) 
        if type_logging == "info":
            print(message)
        
        # checks if it is a problematic eroror type and formats the exception message
        problematic_error_types = ["file_error", "file_missing", "script_error", "critical_json_error"]
        exception = "None"
        if type_logging in problematic_error_types:
            exception = "\n" + traceback.format_exc()
            exception = re.sub('\n', '\n' + ' ' * 51, exception)

        # gets the error name
        err_name = error_name.__class__.__name__ if error_name else "None"

        # formats the log message
        if err_name == "None" or exception == "None":
            log_message = f"[Seconds Elapsed: {time_now:>08.5f}] [{type_logging.replace('_', ' ').title():^20}]: {message}\n"
        else:
            log_message = f"[Seconds Elapsed: {time_now:>08.5f}] [{type_logging.replace('_', ' ').title():^20}]: {message}, Error Name: {err_name}, Exception: {exception}\n"

        # adds the log message to the content
        self.content.append(log_message)

        # ends the program if it is a problematic error type
        if type_logging in problematic_error_types:
            print("An Error occurred, please check log file")
            self.save()
            input("To close the programm press any key")
            sys.exit("")

        # if more than 100 lines are logged, save the log files
        if len(self.content) > 100:
            self.save()


    # logs a message to the log files and the console, but only once for the same message
    def log_same_message_once(self, type, message):
        if message not in self.messages_logged:
            self.messages_logged.add(message)
            self.log(type, message)


    # logs a percentage to the log files and the console
    def log_percentage(self, message, float_n):
        # get the current state. (In total there are 192+1 states, because )
        state = round(float_n * 192)
        # if new state is bigger than the last state, update the last state and print the percentage
        if state > self.percentage_state_last:
            self.percentage_state_last = state
            full_bars = self.percentage_state_last // 8
            sub_bar = [" ", "▏", "▎", "▍", "▌", "▋", "▋", "▊"][self.percentage_state_last % 8] if full_bars < 24 else ""
            spaces = " " * (23 - full_bars)

            print(f"\r{message:<17}: [{'▉' * full_bars + sub_bar + spaces}]", end="")

        # log info messages to the log files, every 10 percent, by using the percentage_step_last variable (it's not logged to the console, because the type is " info " not "info")
        while True:
            if float_n * 10 >= self.percentage_step_last + 1:
                self.log(" info ", f"{message:<17}: {float_n * 100:>6.2f}%")
                self.percentage_step_last += 1
            else:
                break

        # if the percentage is 100, print "Finished" and reset
        if float_n == 1:
            print(" Finished")
            self.percentage_state_last = -1
            self.percentage_step_last = -1