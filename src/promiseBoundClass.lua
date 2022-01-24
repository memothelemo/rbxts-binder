--[=[
	Utility function to promise a bound class on an object
	@class promiseBoundClass
	@edited memothelemo - Port for evaera's Promise module
]=]

local TS = _G[script.Parent]

local Promise = TS.Promise
local Maid = require(script.Parent.Maid)

--[=[
Returns a promise that resolves when the class is bound to the instance.
@param binder Binder<T>
@param inst Instance
@param cancelToken CancelToken
@return Promise<T>
@function promiseBoundClass
@within promiseBoundClass
]=]
return function(binder, inst)
	assert(type(binder) == "table", "'binder' must be table")
	assert(typeof(inst) == "Instance", "'inst' must be instance")

	local class = binder:Get(inst)
	if class then
		return Promise.resolve(class)
	end

	local maid = Maid.new()
	local promise

	promise = Promise.new(function(resolve, _, onCancel)
		onCancel(function()
			if maid ~= nil then
				maid:Destroy()
				maid = nil
			end
		end)
		maid:GiveTask(binder:ObserveInstance(inst, function(classAdded)
			if classAdded then
				if maid ~= nil then
					maid:Destroy()
					maid = nil
				end
				resolve(classAdded)
			end
		end))
	end)

	task.delay(5, function()
		if promise:getStatus() == Promise.Status.Started then
			warn(("[promiseBoundClass] - Infinite yield possible on %q for binder %q\n")
				:format(inst:GetFullName(), binder:GetTag()))
		end
	end)

	return promise
end