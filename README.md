![BPP](branding/logo.png)
# BPP
- ***is** a Blacket modification providing in-browser and userscript support. It uses modern standards, provides innovative features, and provides features for easy development of official and user-made plugins.*
- ***is** easy-to-use and customizable in an accessible and simple manner.*
- *is **NOT** a hack or cheat violating EULA, but rather a safe and acceptable utility providing support for many modifications following the EULA.*

   

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

# Planning and Feature Status

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

## REQUIRED *(DO THIS NOW)*
- **[IN PROGRESS]** Actually finish the registrar/initializer
- **[PLANNING/BRAINSTORMING]** Collect and apply patches via PatchManager.
- **[INCOMPLETE]** Finish built-in plugins.
    - *Optionally* - Provide an external repository for optional, official plugins to reduce script size.
- **[PLANNING/BRAINSTORMING]** Start API wrapper
    - **MAKE SURE THIS IS SIMPLE** - Developing plugins should be motivating and encouraging rather than worrying and confusing.
- **[PLANNING/BRAINSTORMING]** Start theming support
    - Start reverse-engineering class names for BPP UI and Blacket UI.
         - So users have an easier time theming Blacket through explanative variable names rather than confusing classes.
    - Start CSS parser - **OR**: @zastlx is looking into the cost of bundling a SASS compiler.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

## Planned
**Customizations**
- **[PLANNING/BRAINSTORMING]** User themes with extreme support for easy, extensible UI customization through defined variables and presets for BPP and Blacket's UI classes.
- **[APPROVED BY XOTIC, PLANNING]** User-defined (third-party) plugins

---
**API**
- **[PLANNING/BRAINSTORMING]** API wrapper exposed internally and to user-defined plugins
    - ***Caveats*** - Cannot make APIs to write to chat or purchase from bazaar.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
## Doing

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
## Implemented
**Build script**
- **[GOOD]** Plugins - *GetAllPlugins - Dynamically obtain, load and expose a list of all internal plugins via an ESBuild plugin.*
- **[GOOD]** ESBuild script - *Written in TypeScript, executed by Bun - To build BPP in a type-safe manner*

---
**Base(d)**
- **[LOGGABLE - NEEDS FULL REVIEW]** Base classes - *Plugins and Loggables*
- **[GOOD]** Base types - *Phaser types, patch types/interfaces, plugin types/interface, consts*

---
**Managers**
- **[GOOD]** Managers - *PluginManager, PatchManager*

---
**Patcher**
- **[NEEDS FULL REVIEW]** Hard-patching support - *Similar to Vencord*
    - The initial hard patcher was rewritten to operate better and to be more faithful to Vencord's.
- **[NEEDS FULL IMPLEMENTATION]** Soft-patching support - *Via Spitroast*

---
**Patching**
- **[EXPERIMENTAL]** Soft refresh and patch - *This way, we can apply patches to Blacket even after Blacket has fully loaded*
- **[REMOVED]** ~~The option to hard refresh, intercept and patch for Tampermonkey users.~~
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   
# Supporting
**The developers would like to acknowledge and publicly support the following groups/movements**:   
<img height="30" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI4XyT-Kdrs9ItleNPGGIWvdbkOP2mdBQ9Ig&s"> The developers support, acknowledge, and care about those who are transgender or questioning.   
<img height="30" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Nonbinary_flag.svg/255px-Nonbinary_flag.svg.png"> The developers support, acknowledge, and care about those who are non-binary or questioning.   
<img height="30" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Gay_Pride_Flag.svg/1200px-Gay_Pride_Flag.svg.png"> The developers support, acknowledge, and care about the rest of the LGBTQ+ community or those who are questioning.
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   