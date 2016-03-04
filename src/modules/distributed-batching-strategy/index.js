var ReactUpdates = require('react/lib/ReactUpdates');
var ReactCompositeComponent = require('react/lib/ReactCompositeComponent');

var DistributedBatchingStrategy = {
    frameBudget: 1000 / 60,
    pendingUpdates: [],
    isBatchingUpdates: false,

    batchedUpdates: (enqueueUpdate, component, callback) => {
        // Execute top level events right away since we don't know how to estimate them.
        // (without estimation the updates are always separated into one frame each)
        if (!(component instanceof ReactCompositeComponent.Base)) {
            enqueueUpdate(component, callback);
            return;
        }

        this.pendingUpdates.push({enqueue: enqueueUpdate, component, callback });
        this.requestFrameUpdate();
    },
    requestFrameUpdate: () => {
        // Only allow one frame request at a time
        if (!this.isRequestingFrameUpdate) {
            this.isRequestingFrameUpdate = true;
            requestAnimationFrame(this.performFrameUpdates.bind(this));
        }
    },
    performFrameUpdates: () => {
        // Allow frame update requests again
        this.isRequestingFrameUpdate = false;

        var remainingFrameBudget = this.frameBudget;

        // Start with updates we estimate to be done within the frame budget
        var promisingUpdates = this.splicePromisingUpdates();
        if (promisingUpdates.length > 0) {
            remainingFrameBudget -= this.performUpdates(promisingUpdates);
        }

        // Perform as many of the remaining updates as possible within the remaining frame budget
        while (this.pendingUpdates.length > 0 && remainingFrameBudget > 0) {
            var estimatedUpdateTime = this.pendingUpdates[0].component._estimatedUpdateTime || 0;

            // Stop updating early if we estimate following update to break the budget
            if (estimatedUpdateTime > remainingFrameBudget) {
                break;
            }

            // Perform updates and update remaining frame budget
            remainingFrameBudget -= this.performUpdates([this.pendingUpdates.shift()]);
        }

        // Worst case scenario: Force an update if no updates fit the frame budget.
        // (we can't separate an update into multiple updates, sadly).
        if (remainingFrameBudget === this.frameBudget && this.pendingUpdates.length > 0) {
            this.performUpdates([this.pendingUpdates.shift()]);
        }

        // Perform remaining updates next frame
        if (this.pendingUpdates.length > 0) {
            this.requestFrameUpdate();
        }
    },
    performUpdates: (updates) => {
        // Enqueue the updates by bypassing the batching strategy
        this.isBatchingUpdates = true;
        updates.forEach(function (update) {
            update.enqueue(update.component, update.callback);
        });
        this.isBatchingUpdates = false;

        // Flush and measure time spent
        var startTime = Date.now();
        ReactUpdates.flushBatchedUpdates();
        var timeSpent = Date.now() - startTime;

        // Estimate time spent on each component and store it to be able to estimate promising updates
        var estimatedUpdateTime = timeSpent;
        updates.forEach(function (update) {
            update.component._hasUpdateEstimation = true;
            update.component._estimatedUpdateTime = estimatedUpdateTime;
        });

        return timeSpent;
    },
    splicePromisingUpdates: () => {
        // Sort the updates we have estimations on first
        this.pendingUpdates.sort(function (a, b) {
            var aTime = a.component._hasUpdateEstimation ? a.component._estimatedUpdateTime : Number.MAX_VALUE;
            var bTime = b.component._hasUpdateEstimation ? b.component._estimatedUpdateTime : Number.MAX_VALUE;
            return aTime - bTime;
        });

        // Count how many updates we estimate to be able to finish within the frame budget
        var totalEstimatedUpdateTime = 0;
        for (var count = 0; count < this.pendingUpdates.length; count++) {
            var update = this.pendingUpdates[count];
            var thisTotal = totalEstimatedUpdateTime + update.component._estimatedUpdateTime;
            if (thisTotal < this.frameBudget) {
                totalEstimatedUpdateTime = thisTotal;
            } else {
                break;
            }
        }

        // Splice from pending since we will perform these updates separately
        return this.pendingUpdates.splice(0, count);
    }
};

module.exports = DistributedBatchingStrategy;