-- Because of a bug from roblox-ts which I should discuss later
-- Compiled with roblox-ts v1.3.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
-- ▼ rbxts-transformer-fs required function ▼ --
local function ___getInstanceFromPath(entries, waitFor, timeout)
	if waitFor == nil then
		waitFor = false
	end
	local currentIndex = 0
	local lastParent = game
	local currentObject = game
	local modified = true
	local _exp = entries[1]
	repeat
		if _exp == "StarterPlayer" then
			currentObject = game:GetService("Players").LocalPlayer
			lastParent = currentObject
			local _exp_1 = entries[2]
			repeat
				if _exp_1 == "StarterCharacterScripts" then
					local character = currentObject.Character
					if not character then
						error("[rbxts-transformer-fs]: The character isn't loaded but referenced from StarterCharacterScripts", 2)
					end
					currentObject = character
					lastParent = character
					break
				end
				if _exp_1 == "StarterPlayerScripts" then
					local scripts = currentObject.PlayerScripts
					currentObject = scripts
					lastParent = scripts
					break
				end
				error("[rbxts-transformer-fs]: " .. (entries[2] .. " is not a member of StarterPlayer!"))
			until true
			break
		end
		if _exp == "StarterGui" then
			local gui = currentObject:FindFirstChild("PlayerGui")
			if not gui then
				error("[rbxts-transformer-fs]: PlayerGui isn't loaded but referenced from PlayerGui")
			end
			currentObject = gui
			lastParent = currentObject
			break
		end
		if _exp == "StarterPack" then
			local backpack = currentObject.Backpack
			currentObject = backpack
			lastParent = currentObject
			break
		end
		modified = false
		break
	until true
	if modified then
		table.remove(entries, 1)
		table.remove(entries, 1)
	end
	while currentIndex < #entries and currentObject ~= nil do
		lastParent = currentObject
		currentObject = if waitFor then currentObject:WaitForChild(entries[currentIndex + 1], timeout) else currentObject:FindFirstChild(entries[currentIndex + 1])
		currentIndex += 1
	end
	if currentObject == nil then
		table.insert(entries, 1, "game")
		error("[rbxts-transformer-fs]: Cannot find " .. (table.concat(entries, ".") .. (" because " .. (entries[currentIndex + 1] .. (" is not a child of " .. lastParent:GetFullName())))), 2)
	end
	return currentObject
end
local TestBootstrap = TS.import(script, TS.getModule(script, "@rbxts", "testez").src).TestBootstrap
TestBootstrap:run({ ___getInstanceFromPath({ "ServerScriptService", "TS", "specs" }) })
