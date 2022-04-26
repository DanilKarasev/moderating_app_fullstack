# Moderating adds application
Presented app is an interface of moderating adds created by users. Adds being loaded by 10 pcs. To load a new list of ads, you have to make a decision of all 10's. 

# Technical requirements
- Avoid react - redux
- Use hotkeys to each action
- Load adds by batches, 10 pcs each
- Action "Decline" should have commentary, "Escalate" can have one
- Any decision can be changed, before sent to server
- Small backend app on Node, main part is frontend

## Managing adds catalog:
Go in `/server` directory. 

In `createDataList.js` you can find a function that makes adds. \
Default adds quantity:  `50`. \
To change adds quantity, you should change`addsQuantity` to whatever number you want. 

To create catalog of adds run next command:
### `node createDataList`

\
Checked adds writes to `data/completedList.json` \
By default in `completedList.json` should be an `EMPTY ARRAY`

If elements in `completedList.json` equals to elements in `dataList.json` by id, then data will not be loaded, because all tasks are checked.

To restore apps functionality just leave in `completedList.json` an empty array.


## Starting local host:

Go into `/server` directory and run:

### `node start`

By default, localhost runs at http://localhost:8080 \
If you want to change port, just edit `"proxy"` parameter in `package.json`

## Available app commands:

In root directory you can run following commands: 

### `npm i`

Installing depending packages.

### `npm start`

Runs app in dev mode \

### `npm run build`

Making optimized build to deploy.

## Libraries used in app:

### `faker`

Used in `createDataList.js` to make some fake data. 

### `body-parser`

Middleware for Node.js 

### `@emotion`

Library for writing styles on js.

### `react-modal`

Small library with build-in logic of modals.

### `react-toastify`

Notification library.
