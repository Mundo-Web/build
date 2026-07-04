import BasicRest from "../BasicRest";

class RelatedGroupsRest extends BasicRest {
    path = "admin/related-groups";

    async syncItems(groupId, itemIds) {
        const response = await fetch(`/api/admin/related-groups/${groupId}/sync-items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify({ item_ids: itemIds })
        });
        const data = await response.json();
        return data;
    }
}

export default RelatedGroupsRest;
