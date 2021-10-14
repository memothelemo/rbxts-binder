--- Signal wrapper for roblox-ts, so that I can copy Binder's source code with ease
-- @classmod Signal

local TS = _G[script.Parent]
return TS.import(script, TS.getModule(script, "signal"))
