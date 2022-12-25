# Kozma's Backpack bot
A Discord bot for the [Spiral Knights](https://store.steampowered.com/app/99900/Spiral_Knights/) community.

Kozma's Backpack Discord server invite [link](https://discord.gg/nGW89SHHj3).

## How To Use
You can use the bot in any server it is in and in dms. Simply type / and a list of its available commands should pop up. Use /help to get more information about each command.

Make sure you have the following enabled:
- *Use slash commands* in App Settings > Text & Images
- *Allow direct messages from server members* in User Settings > Privacy & Safety

Want to invite the bot to your server? use this [link](https://discord.com/api/oauth2/authorize?client_id=898505614404235266&permissions=66560&scope=bot%20applications.commands).

## Available Commands
<details>
<summary>/bookchance</summary>
  
<br>This command will tell you how bad your luck has been or if you should have played the lottery instead of farming for the Book of Dark Rituals.
</details>

<br>
<details>
<summary>/clear</summary>
  
<br>Don't want to see all previous messages the bot has sent you from /findlogs? Then this command has you covered! it will delete all the messages the bot has sent you.
</details>

<br>
<details>
<summary>/convert</summary>
  
<br>Negotiating a trade but the other person only has crowns (or energy)? Use /convert to quickly find out how much you should ask from the other person to complete the transaction.
</details>

<br>
<details>
<summary>/findlogs</summary>

<br>This is the command this bot even exists. Saw someone advertising an item but don't know how much you should offer? Or did see you something interesting on the auction house and don't know if you should buy it to ~~hoard for months until it gets rerun~~ resell for more? Then /findlogs is here for you! This command will search through our 20k+ tradelogs for the most recent known transactions where the item was a part of.<br>

Extra options:<br>
- *months* ~ By default the bot only looks in the past 6 months but you can extend this period through the *months* option.<br>
- *variants* ~ When looking for equipment and certain color themes the bot automatically looks for items of that equipment's family tree or color themes of similar value. You can disable this through the *variants* option.<br>
- *mixed* ~ By default the bot always look in all channels. The mixed-trades channel doesn't always provide useful info. This option lets you skip that channel.<br>

Qol implementations:<br>
- The bot automatically swaps ctr & asi uvs to return both options when searching.<br>
- The command is **not** case sensitive.<br>
- Certain symbols like - & ' are ignored when using the command.
</details>

<br>
<details>
<summary>/help</summary>

<br>Get a short explanation for each functioning command.
</details>

<br>
<details>
<summary>/lockbox</summary>

<br>Learn more about lockboxes and their rewards.<br>

This command has 3 options:
- *boxes* ~ This option lets you select a lockbox so you can see the possible rewards.<br>
- *slime* ~ Enter a slime box code (QQQ for example) to discover if that box can drop a special color themed box.<br>
- *item* ~ Curious what lockbox drops your item? With this option you can find out which box drops your item and the chance the dropchance.
</details>

<br>
<details>
<summary>/punch</summary>
  
<br>Craft items and roll for Unique Variants without draining your wallet.
</details>

<br>
<details>
<summary>/rate</summary>

<br>Get the current crowns per energy conversion rate.
</details>

<br>
<details>
<summary>/unbox</summary>

<br>Open prizeboxes & lockboxes free of charge!
</details>


## Bot History
<details>
<summary>The Discord Server</summary>
  
<br>Before reading the bot's history it is important you know what it was created for. In September 2020 I and 2 others came together with an idea to help the Spiral Knights trading scene. We have essentialy created a discord based database of Auction House sales & player held trades. This with the goal to level the playing field, giving everyone the same information so they can make educated decisions when negotiating prices with eachother. Every post has the item name written out but searching for an item didn't give the experience I wanted.
</details>

<br>
<details>
<summary>Version 1 - Python</summary>
  
<br>On 23/08/2021 I got the idea to reinvent the discord search function. As I had barely any experience in coding I contacted a [friend](https://github.com/ultrongr) who I knew had some experience with Discord bots. Soon after we had a first working version. No optimisation, poorly written variables & a spamfest of messages each time we used it. The weeks after that the bot only improved. We figured out how to use embeds, dm the command user, delete bot messages etc. The biggest improvement was making the bot only look in specific channels as prior to implementing this, the bot just went through each channel looking for matches. Besides finding an item the bot gained some other functionalities. We added a command to convert your crowns into energy and vice versa which uses the latest crown per energy value. And a command that gave information about lockbox contents and their percentages. As I learned python through working on this bot I was able to implement small improvements on older code along the way. This bot was built using [Discord.py](https://discordpy.readthedocs.io/en/stable/) and reacted based on seeing a certain string. The latest version of the python bot can be found [here](https://replit.com/@ellilglor/Kozmapy#main.py).
</details>

<br>
<details>
<summary>Version 2 - Javascript</summary>
  
<br>For a school assignment I had the task to create both a front-end & back-end api for an idea/project of my choice. I decided to recreate the functionality of searching through the tradelogs as a website. However as this project required javascript I was forced to recreate the bot in Javascript, [Discord.Js](https://discord.js.org/#/) to be specific. When starting on this version of the bot I decided to get it right first time and started learning slash commands instead of working with prefixes. Currently the website and api part of the project are on hold as I have other priorities but I hope to eventually finish those and make them available to the public. Besides the functionalities of the python bot this version already has an unbox simulator built in with more ideas planned. One big improvement over version 1 is that this bot works in any channel & server and works in dms with the bot. For a list of all available commands check the commands section!
</details>


## Donations
Currently I can host the bot for free, however that might change as the bot grows in size & popularity.

Donations are appreciated.

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/ellilglor)