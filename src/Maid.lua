--- Maid wrapper for roblox-ts, so that I can copy Binder's source code with ease
-- @classmod Maid

-- ^ <-- is that how quenty writes his code?

local TS = _G[script.Parent]
return TS.import(script, TS.getModule(script, "maid").Maid)
