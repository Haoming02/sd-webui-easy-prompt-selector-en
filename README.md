# Easy Prompt Selector - EN
This is a fork of the original script, an Extension for the [Automatic1111 Webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui), now with English translations of the buttons.

## How to Use
Click the purple `🔯` button under **Generate** to open its own container. Here, you can select between each categories.
Then, click the tags to add them into the prompt field. You can also toggle `Add to Negative` to add the tags to Negative Prompt instead.

**Note:** Right now only works in `txt2img`

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
  Name: tags, tags, tags
```

## Recommended Use Case
This extension is especially useful for using LoRA. Since most LoRA require **trigger words**, you can create a new `.yml` specifically for LoRAs, and add entries like:
```yml
Character:
  Mana: nagase mana, idol, <lora:mana:0.75>
```
Now, you only need to click the `Mana` button then this extension will add the trigger words along with LoRA syntax for you.

## Original Tutorial (Japanese)
- [使い方(暫定)](https://blue-pen5805.fanbox.cc/posts/5306601)
