def is_community_admin(community, user_id):
    is_permitted = user_id in community.admins
    return is_permitted


def is_community_member(community, user_id):
    is_permitted = user_id in community.members
    return is_permitted


def is_community_active(community):
    return community.is_active
