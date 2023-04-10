/**
 * This function categorize the walk session into 30 minute buckets
 * @param {*} petWalkSession 
 * @param {*} subscriptionId
 */
function function__30_minute_walk_session(args) {
    /**
     * type PetWalkSession @model @auth(rules: [{ allow: custom }, { allow: public }]) {
            petId: String! @primaryKey(sortKeyFields: ["walkerSessionId"])
            walkerId: String!
            petParentId: String! @index(name: "byPetId", sortKeyFields: ["startTime"])
            walkerSessionId: String!
            startTime: AWSTimestamp!
            endTime: AWSTimestamp
            status: SessionState!
            eventData: AWSJSON // PetWalkSessionEventData
        }

      type PetWalkSessionStatsEventData {
            staticMapUrl: String!
            distanceInMeters: Int!
            calories: Int!
            steps: Int!
            location: String!
            maxSpeedInMeters: Float!
        }
     */
    /**
     *  type 30_minute_walk_session {
     *     "properties":  { 
                "date_walktype": "2020-01-01_walktype",
                "__KEY__" : // walktype
                 "__GROUP_VALUE__" // walkone, walktwo, walkthree
              },
            "code": "30_minute_walk_session"
        }
     */
    var petWalkSession = args.petWalkSession;
    const MIN_WALK_DURATION_IN_SECONDS = 15 * 60;
    const MIN_WALK_DISTANCE_IN_METERS = 500;
    // if session time is greater than 15 minutes consider it as a valid session
    if (petWalkSession.endTime - petWalkSession.startTime <= MIN_WALK_DURATION_IN_SECONDS) {
        return null;
    }

    var eventData = JSON.parse(petWalkSession.eventData);
    if(eventData.distanceInMeters < MIN_WALK_DISTANCE_IN_METERS) {
        return null;
    }

    return {
        "properties": {
            "date_walktype": moment(petWalkSession.startTime).format("YYYY-MM-DD") + "_" + eventData.walkType,
            "walktype": eventData.walkType,
        },
        "code": "30_minute_walk_session"
    }    
}