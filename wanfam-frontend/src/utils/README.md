# Utility Functions for Wanfam Frontend

This directory contains utility functions that can be used throughout the Wanfam application. Utility functions are designed to perform common tasks that can be reused in different parts of the application, promoting code reusability and maintainability.

## Available Utility Functions

1. **formatDate(date)**
   - **Description**: Formats a JavaScript Date object into a readable string.
   - **Parameters**: 
     - `date` (Date): The date to format.
   - **Returns**: A string representing the formatted date.

2. **calculateAge(birthDate)**
   - **Description**: Calculates the age based on the provided birth date.
   - **Parameters**: 
     - `birthDate` (Date): The birth date to calculate age from.
   - **Returns**: An integer representing the age in years.

3. **debounce(func, delay)**
   - **Description**: Creates a debounced version of a function that delays invoking it until after `delay` milliseconds have elapsed since the last time the debounced function was invoked.
   - **Parameters**: 
     - `func` (Function): The function to debounce.
     - `delay` (number): The number of milliseconds to delay.
   - **Returns**: A new debounced function.

4. **throttle(func, limit)**
   - **Description**: Creates a throttled version of a function that can only be invoked at most once per every `limit` milliseconds.
   - **Parameters**: 
     - `func` (Function): The function to throttle.
     - `limit` (number): The number of milliseconds to throttle.
   - **Returns**: A new throttled function.

## Usage

To use any of the utility functions in your components or services, simply import them as follows:

```javascript
import { formatDate, calculateAge, debounce, throttle } from '../utils';
```

Make sure to replace the path with the correct relative path based on your file structure.