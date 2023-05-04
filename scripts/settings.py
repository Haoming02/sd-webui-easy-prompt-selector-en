from modules import script_callbacks, shared

def on_ui_settings():
    shared.opts.add_option(
        "eps_enable_save_raw_prompt_to_pnginfo",
        shared.OptionInfo(
            False,
            "Save Original Prompt to PNGInfo",
            section=("easy_prompt_selector", "EasyPromptSelector"),
        ),
    )
    shared.opts.add_option(
        "eps_use_old_template_feature",
        shared.OptionInfo(
            False,
            "Use Legacy Random Function Implementation",
            section=("easy_prompt_selector", "EasyPromptSelector"),
        ),
    )

script_callbacks.on_ui_settings(on_ui_settings)