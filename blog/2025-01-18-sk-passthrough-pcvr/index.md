---
slug: sk-quest-passthrough-pcvr
title: How to Use Meta Quest Passthrough with StereoKit (PCVR)
description: A beginner's guide on how to enable video passthrough on Meta Quest for a PCVR StereoKit project.
image: ./sk-passthrough-2025.gif
authors: jack
tags: [StereoKit, AR, VR, .NET, Meta Quest, Passthrough]
comments: true
---
This guide will show you how to add the Meta Quest passthrough feature to a [StereoKit](https://stereokit.net/) project. This how-to guide assumes we are building an app for PCVR.<!--truncate--> (If you’re looking to enable passthrough on a Native Android StereoKit project, check out [this post](/blog/passthrough-native-android) instead.) You can find all the code in this guide over at [this git repo](https://github.com/jackdaus/StereoKitPassthroughDotNet). 

## Prerequisites

- Meta Quest 2, 3, 3S, or Pro
- Visual Studio 2022
- Windows 10 or 11
- [Meta Quest Link app](https://www.meta.com/quest/setup/)
- [PCVR enabled laptop](https://www.meta.com/help/quest/articles/headsets-and-accessories/oculus-link/requirements-quest-link/) 

## Step 1: Create a new StereoKit project

We will start from scratch by creating a new StereoKit project. The easiest way to get up and running with a fresh StereoKit project is to use a Visual Studio template! To download the templates, run this command in the terminal, 
```
dotnet new install StereoKit.Templates
```

Or, you can install them from the Visual Studio marketplace, here: https://marketplace.visualstudio.com/items?itemName=NickKlingensmith.StereoKitTemplates. 

Now open up Visual Studio. Click on **Create a new project**. Search for "StereoKit" and select **StereoKit .Net Core**. Give your project a name and create it.

![Create new project](./creating-new-project.png)

## Step 2: Get the passthrough code

Next, we need to add the code for the passthrough extension. To do this, right click on your project name in the **Solution Explorer**, click **Add**, then click **Class**. Create a new file named **PassthroughFBExt.cs**. Then paste this code into your new class file:

<details>
<summary>PassthroughFBExt.cs</summary>

```csharp
// SPDX-License-Identifier: MIT
// The authors below grant copyright rights under the MIT license:
// Copyright (c) 2024 Nick Klingensmith
// Copyright (c) 2024 Qualcomm Technologies, Inc.

// This requires an addition to the Android Manifest to work on quest:
// <uses-feature android:name="com.oculus.feature.PASSTHROUGH" android:required="true" />
// And adding this to the application section can also improve the passthrough
// experience:
// <meta-data android:name="com.oculus.ossplash.background" android:value="passthrough-contextual"/>
//
// To work on Quest+Link, you may need to enable beta features in the Oculus
// app's settings.

using System;
using System.Runtime.InteropServices;

namespace StereoKit.Framework
{
	class PassthroughFBExt : IStepper
	{
		bool extAvailable;
		bool enabled;
		bool enableOnInitialize;
		XrPassthroughFB      activePassthrough = new XrPassthroughFB();
		XrPassthroughLayerFB activeLayer       = new XrPassthroughLayerFB();

		Color oldColor;
		bool  oldSky;

		public bool Available => extAvailable;
		public bool Enabled { get => enabled; set {
			if (extAvailable == false || enabled == value) return;
			if (value)
			{
				enabled = StartPassthrough();
			}
			else
			{
				PausePassthrough();
				enabled = false;
			}
		} }

		public PassthroughFBExt() : this(true) { }
		public PassthroughFBExt(bool enabled = true)
		{
			if (SK.IsInitialized)
				Log.Err("PassthroughFBExt must be constructed before StereoKit is initialized!");
			Backend.OpenXR.RequestExt("XR_FB_passthrough");
			enableOnInitialize = enabled;
		}

		public bool Initialize()
		{
			extAvailable =
				Backend.XRType == BackendXRType.OpenXR         &&
				Backend.OpenXR.ExtEnabled("XR_FB_passthrough") &&
				LoadBindings()                                 &&
				InitPassthrough();

			return true;
		}

		public void Step()
		{
			if (Enabled == false) return;

			XrCompositionLayerPassthroughFB layer = new XrCompositionLayerPassthroughFB(
				XrCompositionLayerFlags.BLEND_TEXTURE_SOURCE_ALPHA_BIT, activeLayer);
			Backend.OpenXR.AddCompositionLayer(layer, -1);
		}

		public void Shutdown()
		{
			if (!Enabled) return;
			Enabled = false;
			DestroyPassthrough();
		}

		bool InitPassthrough()
		{
			XrPassthroughFlagsFB flags = enableOnInitialize
				? XrPassthroughFlagsFB.IS_RUNNING_AT_CREATION_BIT_FB
				: XrPassthroughFlagsFB.None;

			XrResult result = xrCreatePassthroughFB(
				Backend.OpenXR.Session,
				new XrPassthroughCreateInfoFB(flags),
				out activePassthrough);
			if (result != XrResult.Success)
			{
				Log.Err($"xrCreatePassthroughFB failed: {result}");
				return false;
			}

			result = xrCreatePassthroughLayerFB(
				Backend.OpenXR.Session,
				new XrPassthroughLayerCreateInfoFB(activePassthrough, flags, XrPassthroughLayerPurposeFB.RECONSTRUCTION_FB),
				out activeLayer);
			if (result != XrResult.Success)
			{
				Log.Err($"xrCreatePassthroughLayerFB failed: {result}");
				return false;
			}

			enabled  = enableOnInitialize;
			StartSky();
			return true;
		}

		void DestroyPassthrough()
		{
			xrDestroyPassthroughLayerFB(activeLayer);
			xrDestroyPassthroughFB(activePassthrough);
		}

		bool StartPassthrough()
		{
			XrResult result = xrPassthroughStartFB(activePassthrough);
			if (result != XrResult.Success)
			{
				Log.Err($"xrPassthroughStartFB failed: {result}");
				return false;
			}

			result = xrPassthroughLayerResumeFB(activeLayer);
			if (result != XrResult.Success)
			{
				Log.Err($"xrPassthroughLayerResumeFB failed: {result}");
				return false;
			}

			StartSky();
			return true;
		}

		void StartSky()
		{
			oldColor = Renderer.ClearColor;
			oldSky   = Renderer.EnableSky;
			Renderer.ClearColor = Color.BlackTransparent;
			Renderer.EnableSky  = false;
		}

		void PausePassthrough()
		{
			XrResult result = xrPassthroughLayerPauseFB(activeLayer);
			if (result != XrResult.Success)
			{
				Log.Err($"xrPassthroughLayerPauseFB failed: {result}");
				return;
			}

			result = xrPassthroughPauseFB(activePassthrough);
			if (result != XrResult.Success)
			{
				Log.Err($"xrPassthroughPauseFB failed: {result}");
				return;
			}

			Renderer.ClearColor = oldColor;
			Renderer.EnableSky  = oldSky;
		}

		#region OpenXR native bindings and types
		enum XrStructureType : UInt64
		{
			XR_TYPE_PASSTHROUGH_CREATE_INFO_FB = 1000118001,
			XR_TYPE_PASSTHROUGH_LAYER_CREATE_INFO_FB = 1000118002,
			XR_TYPE_PASSTHROUGH_STYLE_FB = 1000118020,
			XR_TYPE_COMPOSITION_LAYER_PASSTHROUGH_FB = 1000118003,
		}
		enum XrPassthroughFlagsFB : UInt64
		{
			None = 0,
			IS_RUNNING_AT_CREATION_BIT_FB = 0x00000001,
			LAYER_DEPTH_BIT_FB = 0x00000002
		}
		enum XrCompositionLayerFlags : UInt64
		{
			None = 0,
			CORRECT_CHROMATIC_ABERRATION_BIT = 0x00000001,
			BLEND_TEXTURE_SOURCE_ALPHA_BIT = 0x00000002,
			UNPREMULTIPLIED_ALPHA_BIT = 0x00000004,
		}
		enum XrPassthroughLayerPurposeFB : UInt32
		{
			RECONSTRUCTION_FB = 0,
			PROJECTED_FB = 1,
			TRACKED_KEYBOARD_HANDS_FB = 1000203001,
			MAX_ENUM_FB = 0x7FFFFFFF,
		}
		enum XrResult : Int32
		{
			Success = 0,
		}

#pragma warning disable 0169 // handle is not "used", but required for interop
		[StructLayout(LayoutKind.Sequential)] struct XrPassthroughFB      { ulong handle; }
		[StructLayout(LayoutKind.Sequential)] struct XrPassthroughLayerFB { ulong handle; }
#pragma warning restore 0169


		[StructLayout(LayoutKind.Sequential)]
		struct XrPassthroughCreateInfoFB
		{
			private XrStructureType             type;
			public  IntPtr                      next;
			public  XrPassthroughFlagsFB        flags;

			public XrPassthroughCreateInfoFB(XrPassthroughFlagsFB passthroughFlags)
			{
				type  = XrStructureType.XR_TYPE_PASSTHROUGH_CREATE_INFO_FB;
				next  = IntPtr.Zero;
				flags = passthroughFlags;
			}
		}
		[StructLayout(LayoutKind.Sequential)]
		struct XrPassthroughLayerCreateInfoFB
		{
			private XrStructureType             type;
			public  IntPtr                      next;
			public  XrPassthroughFB             passthrough;
			public  XrPassthroughFlagsFB        flags;
			public  XrPassthroughLayerPurposeFB purpose;

			public XrPassthroughLayerCreateInfoFB(XrPassthroughFB passthrough, XrPassthroughFlagsFB flags, XrPassthroughLayerPurposeFB purpose)
			{
				type  = XrStructureType.XR_TYPE_PASSTHROUGH_LAYER_CREATE_INFO_FB;
				next  = IntPtr.Zero;
				this.passthrough = passthrough;
				this.flags       = flags;
				this.purpose     = purpose;
			}
		}
		[StructLayout(LayoutKind.Sequential)]
		struct XrPassthroughStyleFB
		{
			public XrStructureType             type;
			public IntPtr                      next;
			public float                       textureOpacityFactor;
			public Color                       edgeColor;
			public XrPassthroughStyleFB(float textureOpacityFactor, Color edgeColor)
			{
				type = XrStructureType.XR_TYPE_PASSTHROUGH_STYLE_FB;
				next = IntPtr.Zero;
				this.textureOpacityFactor = textureOpacityFactor;
				this.edgeColor            = edgeColor;
			}
		}
		[StructLayout(LayoutKind.Sequential)]
		struct XrCompositionLayerPassthroughFB
		{
			public XrStructureType             type;
			public IntPtr                      next;
			public XrCompositionLayerFlags     flags;
			public ulong                       space;
			public XrPassthroughLayerFB        layerHandle;
			public XrCompositionLayerPassthroughFB(XrCompositionLayerFlags flags, XrPassthroughLayerFB layerHandle)
			{
				type = XrStructureType.XR_TYPE_COMPOSITION_LAYER_PASSTHROUGH_FB;
				next = IntPtr.Zero;
				space = 0;
				this.flags = flags;
				this.layerHandle = layerHandle;
			}
		}

		delegate XrResult del_xrCreatePassthroughFB       (ulong session, [In] XrPassthroughCreateInfoFB createInfo, out XrPassthroughFB outPassthrough);
		delegate XrResult del_xrDestroyPassthroughFB      (XrPassthroughFB passthrough);
		delegate XrResult del_xrPassthroughStartFB        (XrPassthroughFB passthrough);
		delegate XrResult del_xrPassthroughPauseFB        (XrPassthroughFB passthrough);
		delegate XrResult del_xrCreatePassthroughLayerFB  (ulong session, [In] XrPassthroughLayerCreateInfoFB createInfo, out XrPassthroughLayerFB outLayer);
		delegate XrResult del_xrDestroyPassthroughLayerFB (XrPassthroughLayerFB layer);
		delegate XrResult del_xrPassthroughLayerPauseFB   (XrPassthroughLayerFB layer);
		delegate XrResult del_xrPassthroughLayerResumeFB  (XrPassthroughLayerFB layer);
		delegate XrResult del_xrPassthroughLayerSetStyleFB(XrPassthroughLayerFB layer, [In] XrPassthroughStyleFB style);

		del_xrCreatePassthroughFB        xrCreatePassthroughFB;
		del_xrDestroyPassthroughFB       xrDestroyPassthroughFB;
		del_xrPassthroughStartFB         xrPassthroughStartFB;
		del_xrPassthroughPauseFB         xrPassthroughPauseFB;
		del_xrCreatePassthroughLayerFB   xrCreatePassthroughLayerFB;
		del_xrDestroyPassthroughLayerFB  xrDestroyPassthroughLayerFB;
		del_xrPassthroughLayerPauseFB    xrPassthroughLayerPauseFB;
		del_xrPassthroughLayerResumeFB   xrPassthroughLayerResumeFB;
		del_xrPassthroughLayerSetStyleFB xrPassthroughLayerSetStyleFB;

		bool LoadBindings()
		{
			xrCreatePassthroughFB        = Backend.OpenXR.GetFunction<del_xrCreatePassthroughFB>       ("xrCreatePassthroughFB");
			xrDestroyPassthroughFB       = Backend.OpenXR.GetFunction<del_xrDestroyPassthroughFB>      ("xrDestroyPassthroughFB");
			xrPassthroughStartFB         = Backend.OpenXR.GetFunction<del_xrPassthroughStartFB>        ("xrPassthroughStartFB");
			xrPassthroughPauseFB         = Backend.OpenXR.GetFunction<del_xrPassthroughPauseFB>        ("xrPassthroughPauseFB");
			xrCreatePassthroughLayerFB   = Backend.OpenXR.GetFunction<del_xrCreatePassthroughLayerFB>  ("xrCreatePassthroughLayerFB");
			xrDestroyPassthroughLayerFB  = Backend.OpenXR.GetFunction<del_xrDestroyPassthroughLayerFB> ("xrDestroyPassthroughLayerFB");
			xrPassthroughLayerPauseFB    = Backend.OpenXR.GetFunction<del_xrPassthroughLayerPauseFB>   ("xrPassthroughLayerPauseFB");
			xrPassthroughLayerResumeFB   = Backend.OpenXR.GetFunction<del_xrPassthroughLayerResumeFB>  ("xrPassthroughLayerResumeFB");
			xrPassthroughLayerSetStyleFB = Backend.OpenXR.GetFunction<del_xrPassthroughLayerSetStyleFB>("xrPassthroughLayerSetStyleFB");

			return
				xrCreatePassthroughFB        != null &&
				xrDestroyPassthroughFB       != null &&
				xrPassthroughStartFB         != null &&
				xrPassthroughPauseFB         != null &&
				xrCreatePassthroughLayerFB   != null &&
				xrDestroyPassthroughLayerFB  != null &&
				xrPassthroughLayerPauseFB    != null &&
				xrPassthroughLayerResumeFB   != null &&
				xrPassthroughLayerSetStyleFB != null;
		}
		#endregion
	}
}
```

For the latest version of this code, check out the source at: 

https://github.com/StereoKit/StereoKit/blob/master/Examples/StereoKitTest/Tools/PassthroughFBExt.cs 
</details>

## Step 3: Initialize the passthrough stepper

Now that we’ve got the passthrough code, we’ll need to hook it up to our main program. Open up the **Program.cs** file. Add the `PassthroughFBExt` stepper at the beginning of the program (line 11). You’ll also need to add a `using` statement for `StereoKit.Framework` at the top of the file (line 2):

```csharp title="program.cs" showLineNumbers
using StereoKit;
//highlight-next-line
using StereoKit.Framework;
using System;

namespace PassthroughDotNet
{
    internal class Program
    {
        static void Main(string[] args)
        {
            //highlight-next-line
            SK.AddStepper<PassthroughFBExt>();

            // Initialize StereoKit
            SKSettings settings = new SKSettings
            {
                appName = "PassthroughDotNet",
                assetsFolder = "Assets",
            };
            if (!SK.Initialize(settings))
                Environment.Exit(1);


            // Create assets used by the app
            Pose cubePose = new Pose(0, 0, -0.5f, Quat.Identity);
            Model cube = Model.FromMesh(
                Mesh.GenerateRoundedCube(Vec3.One * 0.1f, 0.02f),
                Default.MaterialUI);

            Matrix floorTransform = Matrix.TS(0, -1.5f, 0, new Vec3(30, 0.1f, 30));
            Material floorMaterial = new Material(Shader.FromFile("floor.hlsl"));
            floorMaterial.Transparency = Transparency.Blend;


            // Core application loop
            while (SK.Step(() =>
            {
                if (SK.System.displayType == Display.Opaque)
                    Default.MeshCube.Draw(floorMaterial, floorTransform);

                UI.Handle("Cube", ref cubePose, cube.Bounds);
                cube.Draw(cubePose.ToMatrix());
            })) ;
            SK.Shutdown();
        }
    }
} 
```

## Step 4: Run it!

Launch the **Meta Quest Link** on your PC. (If you don’t already have it, you can download it [here](https://www.meta.com/quest/setup/)). Plug your Quest into your PC using a USB-C cable (or use Quest Air Link, if you’re into that sort thing). The Meta Quest Link app allows us to use our Quest with PCVR programs. So our program will actually be running on the PC and streamed to our headset! 

You may need to enable passthrough in the Meta Quest Link since it is a relatively new/experimental feature. To do this, open the Meta Quest Link on your PC and head over to **Settings > Beta**. Enable the options for both **Developer Runtime Features** and **Passthrough over Meta Quest Link**.

![enable these options on the Oculus desktop app](meta-quest-link-passthrough-settings.png)

Next, strap on your Quest headset. Open up the **Quick Settings** and select **Quest Link**. (If you don’t see the Quest Link option, then your headset probably isn’t properly connected to your PC! Make sure you are plugged into a USB-C 3.0 port.)

![Select Quest Link from home menu](launch-meta-quest-link.png)

Click the green play button in Visual Studio…

![Smash that play button, fam](launch-app.png)

…and the program will start up with passthrough enabled!

![passthrough-demo](sk-passthrough-2025.gif)

## Bonus: Add a menu to toggle the passthrough

Cool, so now that we got the passthrough enabled, it would be nice if we could toggle it on/off. So let’s add a menu and hook it up to the passthrough stepper. In the **Program.cs** file, we’ll need to access a reference to that Passthrough stepper that we initialized earlier. So go ahead and set it to local variable like this:

```csharp title="Program.cs"
PassthroughFBExt stepper = SK.AddStepper<PassthroughFBExt>();
```

Next, we’ll define a `Pose` for the window. So add another local variable:
```csharp title="Program.cs"
Pose windowPose = new Pose(-0.5f, 0, -0.3f, Quat.LookDir(1, 0, 1));
```

Now in the core application loop, we can render the menu. Add a UI window with a button that is hooked up to the stepper (lines 10-23, below):

```csharp title="Program.cs" showLineNumbers
// Core application loop
while (SK.Step(() =>
{
    if (SK.System.displayType == Display.Opaque)
        Default.MeshCube.Draw(floorMaterial, floorTransform);

    UI.Handle("Cube", ref cubePose, cube.Bounds);
    cube.Draw(cubePose.ToMatrix());

    // highlight-start
    // Passthrough menu
    UI.WindowBegin("Passthrough Menu", ref windowPose);
    if (stepper.Available)
    {
      if (UI.Button("toggle"))
        stepper.Enabled = !stepper.Enabled;

      UI.Label($"Passthrough is {(stepper.Enabled ? "ON" : "OFF")}");
    }
    else
    {
        UI.Label("Passthrough is not available :(");
    }
    UI.WindowEnd();
    // highlight-end

})) ;
```

Great, that’s it! Now you should see a menu to toggle the passthrough on/off.

![passthrough-demo](sk-passthrough-toggle-2025.gif) 

## Summary

To access all the code files used in this guide, check out this git repo here: https://github.com/jackdaus/StereoKitPassthroughDotNet. You can clone this repository and run the completed project on your Quest!