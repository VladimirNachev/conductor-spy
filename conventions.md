1. Name of classes with PascalCase.
2. Three spaces and no tabs.
3. File name conventions:
   - If the file exports only one class -> the name of the class is with PascalCase;
   - If the file is an Angular component/service/etc. or the unit test of one -> whatever the Angular conventions dictate
   - If the file is another kind of a unit test -> the name of the file it tests + ".spec" at the end
4. Directory structure:
   - module name
      - dist
         - (main)
         - (spec)
      - src
         - main
         - spec
5. Whatever is set in tslint.json and tsconfig.json
6. Variable names should be in camelCase.
   Only private static readonly fields (global constants) should be in SCREAMING_CASE.
7. Use const whenever you think a variable should not be changed
