# keep branch up to date with main
```sh
git checkout main
git pull origin main
git checkout feature/your-branch-name
git merge main
```

# development
- clone project 
```sh
git clone https://github.com/ayoubhanine/e-Social-Systems.git
```
- install dependencies
```sh
npm install
```
- pull latest changes
```sh
git pull origin main
```

- create new branch
```sh
git checkout -b feature/example
```

- start development server
```sh
npm run dev
```

# how to push changes
- stage changes
```sh
git add . -v 
```
- commit changes
```sh
git commit -m "your commit message"
```
- push changes
```sh
git push origin feature/your-branch-name
```

