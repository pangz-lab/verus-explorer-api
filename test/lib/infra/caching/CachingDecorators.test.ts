// import { describe, expect, it } from '@jest/globals';
// // import { extractParameters, cache } from "../../../../src/lib/infra/caching/CachingDecorators";
// import { cache } from "../../../../src/lib/infra/caching/CachingDecorators";

// // describe('extractParameters', () => {
// //   it('should extract number with the format "{:1}" from the input string', () => {
// //     const inputString = 'This is a string with {:1} and {:2} placeholders';
// //     const extractedStrings = extractParameters(inputString);
// //     expect(extractedStrings).toEqual([1, 2]);
// //   });
  
// //   it('should extract number in random order from the input string', () => {
// //     const inputString = 'KeySample{:2} and {:4} , {:1}placeholders';
// //     const extractedStrings = extractParameters(inputString);
// //     expect(extractedStrings).toEqual([2, 4, 1]);
// //   });
  
// //   it('should extract number with duplicates from the input string', () => {
// //     const inputString = 'KeySample{:1}{:4}{:2} and {:4} , {:1}placeholders';
// //     const extractedStrings = extractParameters(inputString);
// //     expect(extractedStrings).toEqual([1, 4, 2, 4, 1]);
// //   });

// //   it('should handle empty input string', () => {
// //     const inputString = '';
// //     const extractedStrings = extractParameters(inputString);
// //     expect(extractedStrings).toEqual([]);
// //   });

// //   it('should handle input string without placeholders', () => {
// //     const inputString = 'This is a string without placeholders';
// //     const extractedStrings = extractParameters(inputString);
// //     expect(extractedStrings).toEqual([]);
// //   });
  
// //   it('should convert negative numbers to positive', () => {
// //     const inputString = 'KeySample{:-1}{:-9}{:-2} and {:-4} , {:-1}placeholders';
// //     const extractedStrings = extractParameters(inputString);
// //     expect(extractedStrings).toEqual([undefined, undefined, undefined, undefined, undefined]);
// //   });
  
// //   it('should convert zero and negative numbers to undefined with valid number', () => {
// //     const inputString = 'KeySample{:-1}{:-4}{:2} and {:-4} {:-1}placeholders';
// //     const extractedStrings = extractParameters(inputString);
// //     expect(extractedStrings).toEqual([undefined, undefined, 2, undefined, undefined]);
// //   });
// // });


// describe('cacheResult', () => {
//   it('should return a decorator function that logs the correct messages', () => {
//     // Mock parameters for the cacheResultParams object
//     const params = {
//       key: 'exampleKey',
//       ttlInSeconds: 60,
//     };

//     // Mock target object and PropertyDescriptor
//     const target = {};
//     const propertyKey = 'exampleMethod';
//     const descriptor: PropertyDescriptor = {
//       value: jest.fn(), // Mock original method
//     };

//     // Call the cacheResult function to get the decorator function
//     const decorator = cache(params);

//     // Call the decorator function with the target, propertyKey, and descriptor
//     const decoratedDescriptor = decorator(target, propertyKey, descriptor);

//     // Verify that the descriptor returned by the decorator function is the same as the original descriptor
//     expect(decoratedDescriptor).toBe(descriptor);

//     // Verify that the original method is properly wrapped by the decorator
//     expect(descriptor.value).not.toBe(descriptor.value); // Ensure original method is replaced

//     // Call the wrapped method to trigger the logging
//     descriptor.value();

//     // Assert that the correct messages are logged
//     expect(console.log).toHaveBeenCalledWith(`Static method execution started for method: ${propertyKey}`);
//     expect(console.log).toHaveBeenCalledWith(`Parameters passed to method: ${params.key}, ${params.ttlInSeconds}`);
//     expect(console.log).toHaveBeenCalledWith(`Static method execution finished for method: ${propertyKey}`);
//   });
// });