import asyncio
from app.db.database import SessionLocal
from app.db import models
from app.services import trueforge_service

async def test():
    db = SessionLocal()
    rr = db.get(models.RefundRequest, 'RR-0002')
    print('Before:', rr.status)
    turn = await trueforge_service.get_turn(rr.trueforge_session_id, rr.trueforge_turn_id)
    state = turn.get('state', {})
    actions = state.get('required_actions') or state.get('requiredActions', [])
    print('Actions:', actions)
    if actions:
        rr.status = 'AWAITING_APPROVAL'
        rr.pending_approval_refs = actions
        db.commit()
        print('After:', rr.status)
    db.close()

asyncio.run(test())
