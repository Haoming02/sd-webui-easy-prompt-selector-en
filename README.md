# Easy Prompt Selector - EN
This is a fork of the original script, an Extension for the [Automatic1111 Webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui), now with English translations and various tweaks.

## How to Use
1. Click the purple `🔯` button under **Generate** to open the sub-section
2. Select between categories from the Dropdown
3. Left-click to add the tag into the prompt; Right-click to remove the tag from the prompt
   - Toggle `Add to Negative` to add the tag to the negative field instead
   - Holding `Ctrl` to add the tag to the opposite field instead
     - **ie.** Tag will be added to the positive field, if both `Ctrl` is held and `Add to Negative` is enabled

**Note:** Right now only works in `txt2img`

**Note:** Hides **Extra Networks** section automatically to avoid clutters

## How to Add Entry
The tags are loaded from the `.yml` files inside the `tags` folder. There are a few ways to write entries:

- Category with Tags
```yml
Main Category:
  - tag
  - tag
```

- Sub-Categories within Category
```yml
Main Category:
  Sub Category:
    - tag
  Sub Category:
    - tag
```

- Tags Shortcut
```yml
Main Category:
  Name: tag1, tag2, tag3
```

## Recommended Use Case
This extension is especially useful along with LoRA, as most LoRAs require **trigger words**. 
So you can create a new `.yml` specifically for LoRAs, and add entries like:
```yml
Character:
  Mana: nagase mana, idol, <lora:mana:0.75>
```
Then, you only need to click the `Mana` button to add the trigger words as well as the LoRA syntax.

## Original Tutorial (Japanese)
- [使い方(暫定)](https://blue-pen5805.fanbox.cc/posts/5306601)
