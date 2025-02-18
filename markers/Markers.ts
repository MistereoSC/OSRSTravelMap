export interface IMarkerGroupRaw {
    gid: number,
    gIcon: number,
    ms: IMarkerRaw[]
    gName: string,
}

export interface IMarkerRaw {
    x: number,
    y: number,
    uid: number, // Unique ID
    gid: number, // Group ID,
    lms?: number[], // Linked Markers UID
    st: string, // Subtitle
    des?: string, // Description
}

export interface IMarker {
    pos: {x: number, y:number},
    title: string,
    subtitle: string,
    description?: string,
    icon_path: string,

    marker_id: number,
    group_id: number,

    linked_markers?: number[],
}

export interface IMarkerGroup {
    group_id: number,
    name: string,
    icon_path: string,
    markers: number[],
}

export const EIconId = [
    "fairyStaff.webp",
    "spiritTree.webp",
    "teleport_standard.webp",
    "teleport_arceuus.webp",
    "teleport_ancient.webp",
    "teleport_lunar.webp",
    "house.webp"
]

import MARKERS from './mlist.json'
export function createMarkerList() {
    // @ts-ignore
    const markerListRaw = MARKERS as IMarkerGroupRaw[]
    const markerArray = [] as IMarker[]
    const groupArray = [] as IMarkerGroup[]

    for (const group of markerListRaw) {
        const markers = group.ms
        const newGroup: IMarkerGroup = {
            group_id: group.gid,
            name: group.gName,
            icon_path: EIconId[group.gIcon],
            markers: []
        }
        for (const marker of markers) {
            markerArray.push({
                pos: {x: marker.x, y: marker.y},
                title: group.gName,
                subtitle: marker.st,
                description: marker.des,
                icon_path: EIconId[group.gIcon],
                marker_id: marker.uid,
                group_id: group.gid,
                linked_markers: marker.lms
            })
            newGroup.markers.push(marker.uid)
        }
        groupArray.push(newGroup)
    }

    return {groups: groupArray, markers: markerArray}
}
// Missing Markers: Fairy Rings: ALR, BJR, BKQ, BLQ, CKP, DIP, DIQ, DIR